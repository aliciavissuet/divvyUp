import Overlay from './overlay';
import * as d3 from 'd3';
import {time} from './overlay';
console.log(time, 'map');


console.log('alicia');
const initMap = () => {
    let map;
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.8781, lng: -87.6428 },
        zoom: 13,
        styles: styles['hide'],
        disableDefaultUI: true
    });
    const bounds = map.getBounds();
    console.log(bounds);
    const data = d3.csv('../d.csv').then((data) =>  new Overlay(bounds, null, map, data));
    
    
    // const overlay = new Overlay(bounds, null, map, data);
    // overlay.onAdd();
};


const styles = {
    default: null,
    hide: [

        {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }]
        },
        {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }]
        },
        {
            featureType: 'all',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }]
        },
        {
            featureType: "all",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        },


        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },

        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
        },

        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }]
        },

        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }]
        },

        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
        },

    ],
};

google.maps.event.addDomListener(window, "load", initMap);
