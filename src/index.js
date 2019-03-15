console.log("working ");

import map from '../components/map.js';
import overlay from '../components/overlay';
import * as d3 from 'd3';
import Clock from '../components/clock';
import digitalTime from '../components/time';

const square = d3.selectAll("rect");
square.style("fill", "orange");
// map.initMap();
// Clock.drawClock();