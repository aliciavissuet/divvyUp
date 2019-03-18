import * as d3 from 'd3';
// import {time} from '../components/overlay';


let t = time;

const getTime = () => {
    t = time;
};

const data = d3.csv('../minutesData.csv')


const drawGender = (data) => {

    // debugger;
    const min = Math.floor(time/60);

    d3.select('#genderdisplay').style('display','flex')

    const female = d3.select('#fem')
    .style('width', `${parseFloat((data[min].femaleCount)) / (parseFloat(data[min].femaleCount) + parseFloat(data[min].maleCount)) *100}px`)
        .style('background', '#48c3e7');


    const male  = d3.select('#male')
        .style('width', `${parseFloat((data[min].maleCount)) / (parseFloat(data[min].femaleCount) + parseFloat(data[min].maleCount)) * 100}px`)
        .style('background', '#569dee')
        .style('text-align', 'right')



};
const drawDT = (data) => {

    // debugger;
    const min = Math.floor(time / 60);

    d3.select('#dtdisplay').style('display', 'flex')

    const going = d3.select('#going')
        .style('width', `${Math.max(parseFloat((data[min].goingDT)), 1 )/ Math.max((parseFloat(data[min].goingDT) + parseFloat(data[min].leavingDT)), 2) * 100}px`)
        .style('background', '#48c3e7');


    const leaving = d3.select('#leaving')
        .style('width', `${Math.max(parseFloat((data[min].leavingDT)), 1) / Math.max((parseFloat(data[min].goingDT) + parseFloat(data[min].leavingDT)), 2) * 100}px`)
        .style('background', '#569dee')
        .style('text-align', 'right')



};

document.addEventListener("DOMContentLoaded", () => {
    
    setInterval(function () {
        getTime();
        data.then( data =>{
            drawDT(data);
            drawGender(data);});
    }, 1000);
});