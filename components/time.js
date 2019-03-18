// import {time, speed} from './overlay';
import * as d3 from 'd3';

let slider = null;
let speedSlider = null;
let t = time;
function displayTime() {
    let hours = Math.floor(t / 3600);
    let minutes = Math.floor((t - (hours * 3600)) / 60);
    let seconds = t - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}
slider = document.querySelector('#time');


function digitalTime() {
    d3.select('#digitaltime')
    
    .text(displayTime());
}
function getTime() {
    t = time;
}
function inputTime(val) {
  
    slider.value = parseInt(val);
    time = parseInt(val);
}
function updateTime() {
 
    slider.value = t;
}
document.addEventListener("DOMContentLoaded", () => {
    console.log('listening to time');
    slider = document.querySelector('#time');
    speedSlider = document.querySelector('#speed');
    speedSlider.value = speed;
    setInterval(function () {
        getTime(); 
        digitalTime();
        updateTime();
    }, 100);
});