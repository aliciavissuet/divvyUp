import * as d3 from 'd3';
const parent = google.maps.OverlayView;

class MapOverlay extends parent {
    constructor(bounds, image, map, data) {
        super(...arguments);
        this.data = data;
        this.bounds_ = bounds;
        // this.image_ = image;
        this.map_ = map;
        this.div_ = null;
        this.time = 29000;
        this.setMap(map);

        // this.onAdd = this.onAdd.bind(this);
        // this.draw = this.draw.bind(this);
    }

    onAdd() {
        // debugger;
        // var div = document.select('div');
        var div = document.getElementById('map-overlay');
        div.style.borderStyle = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';
        div.style.backgroundColor = 'navy';
        this.div_ = div;
        const panes = this.getPanes();
        panes.overlayLayer.appendChild(div);

        // add a listener to re-mask the new bounds on each map drag
       

            //new 
        // const layer = d3.select(this.getPanes().overlayLayer).append("div")
        //     .attr();
        this.draw();    
        window.google.maps.event.addListener(this.map_, 'center_changed', () => {
            this.draw(this.time);
        });
    }

    draw(time) {
        
        // console.log(this.data);
        // get current bounds, mask that junk yo
        let overlayProjection = this.getProjection(), padding = 10;
        let bounds = this.map_.getBounds();
        let bounds2 = new google.maps.LatLngBounds(
            new google.maps.LatLng(62.281819, -150.287132),
            new google.maps.LatLng(62.400471, -150.005608));
        let sw = overlayProjection.fromLatLngToDivPixel(bounds.getSouthWest());
        let ne = overlayProjection.fromLatLngToDivPixel(bounds.getNorthEast());

        this.bounds_ = bounds;
        // console.log('bounds', bounds.getSouthWest());
        var div = this.div_;
        
        div.style.left = sw.x + 'px';
        div.style.top = ne.y +'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';
        
        // var projection = this.getProjection(),
        //     padding = 10;
        // const layer = d3.select('id', 'map-overlay');
            
        //     .attr("class", "stations");
        const layer = d3.select(this.getPanes().overlayLayer);
    
        const marker = layer.selectAll("svg")
            .data(d3.entries(this.data))
            .each(transform) // update existing markers
            .enter().append("svg")
            .each(transform)
            .attr("class", "marker")
            .style('position', 'absolute')

        // marker.append("circle")
        //     .attr("r", 4.5)
        //     .attr("cx", padding)
        //     .attr("cy", padding)

        // Add a label.
        // marker.append("text")
        //     .attr("x", padding + 7)
        //     .attr("y", padding)
        //     .attr('z-index', "10000000000000")
        //     .text(function (d) { return 'X'});
        function transform(d) {
            const { display, lat, lon} = position(d, 30000);
            if (!display || !lat || !lon) {
                return d3.select(this)
                    .style('display', 'none')
            }

            d = new google.maps.LatLng(lat, lon);

            d = overlayProjection.fromLatLngToDivPixel(d);

            return d3.select(this)
                .style("left", (d.x - padding) + "px")
                .style("top", (d.y - padding) + "px");
        }

        function position(d, currTime) {
            
            const p = parseFloat;
            const startTime = p(d.value.startTimeSeconds);
            const stopTime = p(d.value.stopTimeSeconds);
            const timeDelta = p(d.value.timeDelta);
            if ( startTime > currTime || stopTime < currTime) {
                return {
                    lat: null,
                    lon: null,
                    display:false,
                };
            } 
   
            
            const startLat = p(d.value.latitude_start);
            const startLon = p(d.value.longitude_start);
            const endLat = p(d.value.latitude_end);
            const endLon = p(d.value.longitude_end);

       

            const currLat = ((currTime - startTime)*(endLat - startLat)/(timeDelta )+ startLat)
            const currLon = ((currTime - startTime)*(endLon - startLon)/(timeDelta) + startLon)
   

            return {
                lat: Number(currLat),
                lon: Number(currLon),
                display: true
            };

        }
    }
}
export default MapOverlay;



// // Draw each marker as a separate SVG element.
// // We could use a single SVG, but what size would it have?
// overlay.draw = function () {
    

    // Add a circle.
    