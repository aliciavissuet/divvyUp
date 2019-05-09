import * as d3 from 'd3';
const parent = google.maps.OverlayView;
export var speed = 10;
export var prevSpeed = null;
var female = false;
var male = false;
var goingDT = false;
var leavingDT = false;
const c = console.log;
const velocity = 6
const slider = document.querySelector('#time');
var pause = false;

function addClass(selector, myClass) {
    let elements;

    // get all elements that match our selector
    elements = document.querySelectorAll(selector);

    // add class to all chosen elements
    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.add(myClass);
    }
}

function removeClass(selector, myClass) {
    let elements;
    // get all elements that match our selector
    elements = document.querySelectorAll(selector);

    // remove class from all chosen elements
    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove(myClass);
    }
}

//some skeleton code taken from javascript google maps api
class MapOverlay extends parent {
    constructor(bounds, image, map, data, directionsService) {
        super(...arguments);
        this.data = data;
        this.bounds_ = bounds;
        
        this.map_ = map;
        this.directionsService = directionsService;
        this.div_ = null;

        this.setMap(map);
        this.increaseTime = this.increaseTime.bind(this);
        this.draw = this.draw.bind(this);
        
        window.reset = this.reset;
        window.pause = this.pause;
        window.play = this.play;
        document.getElementById('play').addEventListener('click', () => this.play());
        document.getElementById('pause').addEventListener('click', () => this.pause());
        document.getElementById('reset').addEventListener('click', () => this.reset());
        document.getElementById('speed').addEventListener('change', (e) => this.setSpeed(e.target.value));
        // document.getElementById('time').addEventListener('dragstart', (e) => {this.pause();});
        document.getElementById('time').addEventListener('click', (e) => {this.setTime(e.target.value);});
        // document.getElementById('time').addEventListener('dragend', (e) => { this.pause(setTime(e.target.value));});
        document.getElementById('fem').addEventListener('mouseover', ()=> this.displayFemale());
        document.getElementById('male').addEventListener('mouseover', ()=> this.displayMale());
        document.getElementById('fem').addEventListener('mouseleave', ()=> this.displayAll());
        document.getElementById('male').addEventListener('mouseleave', ()=> this.displayAll());
        document.getElementById('going').addEventListener('mouseover', ()=> this.displayGoingDT());
        document.getElementById('leaving').addEventListener('mouseover', ()=> this.displayLeavingDT());
        document.getElementById('going').addEventListener('mouseleave', ()=> this.displayAll());
        document.getElementById('leaving').addEventListener('mouseleave', ()=> this.displayAll());
    }
    

    increaseTime (func){
        return window.setInterval(() => {
            time += speed;
            
            func();
        }, 100); 
       
    }

    pause() {
        window.clearInterval(this.increaseTime);
        window.clearInterval(this.onAdd);
        // this.onRemove();
        // console.log('pause');
        prevSpeed = speed;
        speed=0;
        pause = true;
        addClass('#pause', 'selected');
        removeClass('#play', 'selected');
    }
    play(){
        // console.log(prevSpeed);
        speed = prevSpeed;
        pause = true;
        addClass('#play', 'selected');
        removeClass('#pause', 'selected');
    }
    reset(){
        time = 0;
        speed = 5;
        this.increaseTime(this.draw);
    }
    setSpeed(value) {
        
        speed = parseInt(value);
    }
    setTime(value) {
     
        this.pause();
        prevSpeed = 100;
        time = parseInt(value);
        slider.value = time;
        this.play();
       
    }


    onAdd() {
        var div = document.getElementById('map-overlay');
        div.style.borderStyle = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';
        this.div_ = div;
        const panes = this.getPanes();
        panes.overlayLayer.appendChild(div);   
        this.increaseTime(this.draw);
        window.google.maps.event.addListener(this.map_, 'center_changed', () => {
            this.draw();
        });
       
    }

    draw() {
        let overlayProjection = this.getProjection(), padding = 10;
        let bounds = this.map_.getBounds();
        let bounds2 = new google.maps.LatLngBounds(
            new google.maps.LatLng(62.281819, -150.287132),
            new google.maps.LatLng(62.400471, -150.005608));
        let sw = overlayProjection.fromLatLngToDivPixel(bounds.getSouthWest());
        let ne = overlayProjection.fromLatLngToDivPixel(bounds.getNorthEast());
        const ds = this.directionsService;

        this.bounds_ = bounds;
        var div = this.div_;
        
        div.style.left = sw.x + 'px';
        div.style.top = ne.y +'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';

        const layer = d3.select(this.getPanes().overlayLayer);

        const marker = layer.selectAll("svg")
            .data(d3.entries(this.data))
            .each(transform) 
            .enter().append("svg")
            .each(transform)
            .attr("class", "marker")
            .style('position', 'absolute');

        function transform(d) {
            const style = (d.value.gender === 'Male') ? '#2e60cc' : '#b3cbe5';
            const { display, lat, lon} =  position(d, time);
            const genderCondition = (d.value.gender === 'Male' && female) || (d.value.gender === 'Female' && male);
            const downtownCondition = ((!isGoingDT(d) && goingDT) || (!isLeavingDT(d) && leavingDT));
            // c(isGoingDT(d));
            if (!display || !lat || !lon || genderCondition || downtownCondition) {
                return d3.select(this)
                    .style('display', 'none');
            }

            d = new google.maps.LatLng(lat, lon);
            d = overlayProjection.fromLatLngToDivPixel(d);

            return d3.select(this)
                .style("left", (d.x - padding) + "px")
                .style("top", (d.y - padding) + "px")
                .style('display', 'block')
                .style('z-index', 10000000000)
                .style('background', style);
               

        }

        function position(d, currTime) {
            const p = parseFloat;
            const startTime = p(d.value.startTimeSeconds);
            const stopTime = p(d.value.startTimeSeconds) + p(d.value.total_distance)/velocity;
            
            if (!p(d.value.total_distance) || !(startTime < currTime && currTime < stopTime) ) {

                return {
                    lat: null,
                    lon: null,
                    display:false,
                };
            }
            
            let pos;
            try{
                pos = current_location(JSON.parse(d.value.stepsJson), currTime - startTime, d.value.total_distance);
            } catch(e) {
                // console.log(e)
                pos = {
                    lat: null,
                    lon: null,
                    display: false,
                };
            }
            return pos;

        }
        
    }
    displayFemale() {
        female = true;
    }
    displayMale() {
        male = true;
    }
    displayAll() {
        female = false;
        male = false;
        goingDT = false;
        leavingDT = false;
    }
    displayGoingDT(){
        
        goingDT = true;
    }
    displayLeavingDT(){
 
        leavingDT = true;
    }

}
export default MapOverlay;


const current_location = (steps, time, td) => {
    const p = parseFloat;
    let i = 0;
    let distanceCovered = 0;
    
    while (distanceCovered <= time*velocity) {
        
        distanceCovered += steps[i].distance
        
        
        i++
    }
    i--


    const timeTillInterval = (distanceCovered - steps[i].distance )/ velocity;

    const t = time - timeTillInterval;

    const startLat = p(steps[i].start_location.lat);
    const startLon = p(steps[i].start_location.lng);

    const endLat = p(steps[i].end_location.lat)
    const endLon = p(steps[i].end_location.lng)

    const currLat = ((t) * (endLat - startLat) / (steps[i].distance / velocity )+ startLat)
    const currLon = ((t) * (endLon - startLon) / (steps[i].distance / velocity) + startLon)
    return {
        lat: Number(currLat),
        lon: Number(currLon),
        display: true
    };

};

const endDT = (d) => {
    
    return ((41.863426 < parseFloat(d.value.latitude_end) && parseFloat(d.value.latitude_end) < 41.889034 && 
        - 87.604406 > parseFloat(d.value.longitude_end) && parseFloat(d.value.longitude_end)> -87.637359));
};
const startDT = (d) => {
  
    return (41.863426 < parseFloat(d.value.latitude_start) && parseFloat(d.value.latitude_start )< 41.889034 
        && - 87.604406 > parseFloat(d.value.longitude_start) && parseFloat(d.value.longitude_start) > -87.637359);
};

const isGoingDT= (d) => {
    return endDT(d) && !startDT(d);
};
const isLeavingDT = (d) => {
    return !endDT(d) && startDT(d);
};
