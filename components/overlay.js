import * as d3 from 'd3';
const parent = google.maps.OverlayView;
export var time = 24000;
export var speed = 100;
export var prevSpeed = null;
var female = false;
var male = false;


class MapOverlay extends parent {
    constructor(bounds, image, map, data, directionsService) {
        super(...arguments);
        this.data = data;
        this.bounds_ = bounds;
        // this.image_ = image;
        this.map_ = map;
        this.directionsService = directionsService;
        this.div_ = null;

       
        // this.data.forEach(d => {
        //     try {
        //         d.value.stepsJson = JSON.parse(d.value.stepsJson);
        //     } catch(e) {

        //     }
        // });
        // this.time = 32000;
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
        document.getElementById('time').addEventListener('change', (e) => {this.setTime(e.target.value);});
        document.getElementById('fem').addEventListener('mouseover', ()=> this.displayFemale());
        document.getElementById('male').addEventListener('mouseover', ()=> this.displayMale());
        document.getElementById('fem').addEventListener('mouseleave', ()=> this.displayAll());
        document.getElementById('male').addEventListener('mouseleave', ()=> this.displayAll());
    }
    

    increaseTime (func){
        window.setInterval(() => {
            time += speed;
            func();
        }, 100); 
       
    }

    pause() {
        console.log('pause');
        prevSpeed = speed;
        speed=0;
    }
    play(){
        speed = prevSpeed;
    }
    reset(){
        time = 0;
        speed = 5;
        this.increaseTime(this.draw);
    }
    setSpeed(value) {
        // console.log(parseInt(value));
        speed = parseInt(value);
    }
    setTime(value) {
        time = parseInt(value);
        console.log('tv', time, speed);
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
            .style('position', 'absolute')

            // .style('background', (d.value.gender ? 'blue' : 'yellow'));
            
            // .style('z-index', 700000000000);

        // marker.append("circle")
        //     .attr("r", 4.5)
        //     .attr("cx", padding)
        //     .attr("cy", padding)

        // Add a label.
        // marker.append("text")
        //     .attr("x", padding + 7)
        //     .attr("y", padding)
        //     .attr('z-index', "10000000000000")
        //     .append('text')
            
        function transform(d) {
            const style = (d.value.gender === 'Male') ? '#2e60cc' : '#b3cbe5';
            const { display, lat, lon} =  position(d, time);
  
            if (!display || !lat || !lon || (d.value.gender === 'Male' && female) || (d.value.gender === 'Female' && male)) {
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
                .style('background', style)
                // .style('box-shadow', `2px 1px 0.5px 0.25px ${style}`)
                // .append('text', this.value.trip_duration);
                // .style('')

        }

        function position(d, currTime) {
            const p = parseFloat;
            const startTime = p(d.value.startTimeSeconds);
            const stopTime = p(d.value.startTimeSeconds) + 1200;
            // const timeDelta = p(d.value.timeDelta);
            if ( startTime > currTime || stopTime < currTime ) {

                return {
                    lat: null,
                    lon: null,
                    display:false,
                };
            } 
            let pos;
            try{
                 pos = current_location(JSON.parse(d.value.stepsJson), currTime-startTime);
            } catch(e) {
                // console.log(e);
                pos = {
                    lat: null,
                    lon: null,
                    display: false,
                };
            }
            return pos;
            // const startLat = p(d.value.latitude_start);
            // const startLon = p(d.value.longitude_start);
            // const endLat = p(d.value.latitude_end);
            // const endLon = p(d.value.longitude_end);
            // const steps  = d.value.steps;
            // const totalStepsDistance = d.value.stepsDistance;
            // const numSteps = steps.length;
            // const currStep = 
            // const pointI = (currTime - startTime)/numPoints;
            // const lowPoint = points[Math.floor(pointI)];
            // const highPoint = points[Math.ceil(pointI)];
            // const pointTimeDelta = timeDelta/numPoints;
            


            // const currLat = ((currTime - startTime)*(endLat - startLat)/(timeDelta )+ startLat)
            // const currLon = ((currTime - startTime)*(endLon - startLon)/(timeDelta) + startLon)
            

            // return {
            //     lat: Number(currLat),
            //     lon: Number(currLon),
            //     display: true
            // };

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
    }

}
export default MapOverlay;


const current_location = (steps, time) => {
    const p = parseFloat;
    let i = 0;
    let distanceCovered = 0;
    while(true){
        distanceCovered += steps[i].distance;
        if (time/2 < distanceCovered){
            break;
        }
        i++;
    }
    const timeInInterval = distanceCovered * 2 - steps[i].distance * 2;
    const t = time - timeInInterval;

    const startLat = p(steps[i].start_location.lat);
    const startLon = p(steps[i].start_location.lng);

    const endLat = p(steps[i].end_location.lat)
    const endLon = p(steps[i].end_location.lng)

    const currLat = ((t) * (endLat - startLat) / (steps[i].distance * 2 )+ startLat)
    const currLon = ((t)*(endLon - startLon)/(steps[i].distance*2) + startLon)

    return {
        lat: Number(currLat),
        lon: Number(currLon),
        display: true
    };

};
