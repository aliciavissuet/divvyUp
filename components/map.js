import Overlay from './overlay';
import * as d3 from 'd3';
// import {time} from './overlay';
console.log(time, 'map');


console.log('alicia');
const initMap = () => {
    let map;
    let directionsService;
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.8781, lng: -87.6428 },
        zoom: 13,
        styles: styles['hide'],
        disableDefaultUI: true
    });
    directionsService = new google.maps.DirectionsService;

    const bounds = map.getBounds();
    console.log(bounds);
    const data = d3.csv('./DivvyDataWithSteps.csv').then((data) =>  new Overlay(bounds, null, map, data, directionsService));
    
    
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


        { elementType: 'geometry', stylers: [{ color: '#0f0f0f' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },

        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#040404' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#32373d' }, {weight: '0.9px'}]
        },

        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#040404' }, {lightness: '2'}]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#040404' }, { weight: '0.9px' }]
        },

        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ visibility: 'off' }]
        },

        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#32373d' }]
        },

    ],
};

google.maps.event.addDomListener(window, "load", initMap);
