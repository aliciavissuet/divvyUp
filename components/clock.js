import * as d3 from 'd3';
// import {time} from './overlay';
let radians = 0.0174532925,
    clockRadius = 40,
    margin = 20,
    width = (clockRadius + margin) * 2,
    height = (clockRadius + margin) * 2,
    hourHandLength = 2 * clockRadius / 3,
    minuteHandLength = clockRadius,
    secondHandLength = clockRadius - 12,
    secondHandBalance = 30,
    secondTickStart = clockRadius,
    secondTickLength = -5,
    hourTickStart = clockRadius,
    hourTickLength = -10,
    secondLabelRadius = clockRadius + 16,
    secondLabelYOffset = 5,
    hourLabelRadius = clockRadius - 40,
    hourLabelYOffset = 7;


const hourScale = d3.scaleLinear()
    .range([0, 330])
    .domain([0, 11]);

const minuteScale = d3.scaleLinear()
    .range([0, 354])
    .domain([0, 59]);
const secondScale = d3.scaleLinear()
    .range([0, 354])
    .domain([0, 59]);

const handData = [
    {
        type: 'hour',
        value: 0,
        length: -hourHandLength,
        scale: hourScale
    },
    {
        type: 'minute',
        value: 0,
        length: -minuteHandLength,
        scale: minuteScale
    }
];

function updateData() {
    // console.log(time);
    var t = new Date(time * 1000);
    handData[0].value = (t.getHours() % 12 - 4) + t.getMinutes() / 60;
    handData[1].value = t.getMinutes();
    // console.log('h', handData[0]);
    // handData[2].value = t.getSeconds();
}

function drawClock() {
     //create all the clock elements
    updateData();	//draw them in the correct starting position
    const svg = d3.select("#clock").append("svg")
        .attr("width", width)
        .attr("height", height)
        // .attr('background-color', 'blue');

    const face = svg.append('g')
        .attr('id', 'clock-face')
        .attr('transform', 'translate(' + (clockRadius + margin) + ',' + (clockRadius + margin) + ')');

    // add marks for seconds
    face.selectAll('.second-tick')
        .data(d3.range(0, 60)).enter()
        .append('line')
        .attr('class', 'second-tick')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', secondTickStart)
        .attr('y2', secondTickStart + secondTickLength)
        .attr('transform', function (d) {
            return 'rotate(' + secondScale(d) + ')';
        });
    //and labels

    // face.selectAll('.second-label')
    //     .data(d3.range(5, 61, 5))
    //     .enter()
    //     .append('text')
    //     .attr('class', 'second-label')
    //     .attr('text-anchor', 'middle')
    //     .attr('x', function (d) {
    //         return secondLabelRadius * Math.sin(secondScale(d) * radians);
    //     })
    //     .attr('y', function (d) {
    //         return -secondLabelRadius * Math.cos(secondScale(d) * radians) + secondLabelYOffset;
    //     })
    //     .text(function (d) {
    //         return d;
    //     });

    //... and hours
    face.selectAll('.hour-tick')
        .data(d3.range(0, 12)).enter()
        .append('line')
        .attr('class', 'hour-tick')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', hourTickStart)
        .attr('y2', hourTickStart + hourTickLength)
        .attr('transform', function (d) {
            return 'rotate(' + hourScale(d) + ')';
        });

    // face.selectAll('.hour-label')
    //     .data(d3.range(3, 13, 3))
    //     .enter()
    //     .append('text')
    //     .attr('class', 'hour-label')
    //     .attr('text-anchor', 'middle')
    //     .attr('x', function (d) {
    //         return hourLabelRadius * Math.sin(hourScale(d) * radians);
    //     })
    //     .attr('y', function (d) {
    //         return -hourLabelRadius * Math.cos(hourScale(d) * radians) + hourLabelYOffset;
    //     })
    //     .text(function (d) {
    //         return d;
    //     });


    var hands = face.append('g').attr('id', 'clock-hands');

    face.append('g').attr('id', 'face-overlay')
        .append('circle').attr('class', 'hands-cover')
        .attr('x', 0)
        .attr('y', 0)
        .attr('r', clockRadius / 20);

    hands.selectAll('line')
        .data(handData)
        .enter()
        .append('line')
        .attr('class', function (d) {
            return d.type + '-hand';
        })
        .attr('x1', 0)
        .attr('y1', function (d) {
            return d.balance ? d.balance : 0;
        })
        .attr('x2', 0)
        .attr('y2', function (d) {
            return d.length;
        })
        .attr('transform', function (d) {
            return 'rotate(' + d.scale(d.value) + ')';
        });
}

function moveHands() {
    d3.select('#clock-hands').selectAll('line')
        .data(handData)
        .transition()
        .attr('transform', function (d) {
            return 'rotate(' + d.scale(d.value) + ')';
        });
}



// drawClock();

// setInterval(function () {
//     updateData();
//     moveHands();
// }, 1000);

document.addEventListener("DOMContentLoaded", ()=> {
    console.log('listening');
    drawClock();
    setInterval(function () {
        updateData();
        moveHands();
    }, 100);
});