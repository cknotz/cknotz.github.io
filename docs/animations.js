//////////////////////////////////////////////////////////////////
// Continuously updating bar chart & hovering 'back to top' button
//////////////////////////////////////////////////////////////////

// Carlo Knotz

// Credit belongs to:
 // Scott Murray's book 'Interactive Data Visualization for the Web'
 // d3noob (https://bl.ocks.org/d3noob/bf44061b1d443f455b3f857f82721372)
 // https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
 // https://developer.mozilla.org/en-US/docs/Web/JavaScript
 // ChatGPT for (most of) the animated scatter plot

 console.log("Hello there!")

if (Math.random() < .5) {
 
random = function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

var dataset = [ random(min=5,max=45), random(min=5,max=45), random(min=5,max=45),
  random(min=5,max=45), random(min=5,max=45), random(min=5,max=45),
  random(min=5,max=45), random(min=5,max=45), random(min=5,max=45),
  random(min=5,max=45), random(min=5,max=45), random(min=5,max=45),
  random(min=5,max=45), random(min=5,max=45), random(min=5,max=45),
  random(min=5,max=45), random(min=5,max=45), random(min=5,max=45),
  random(min=5,max=45), random(min=5,max=45) ];

var win_w = window.innerWidth
var win_h = window.innerHeight

//Width, height and margin
var margin = {top: 50, bottom: 20, right: 15, left: 75};
var w=.2 * win_w;
var h=.33 * win_h;
var barPadding = 1; // <-- New! Padding between bars
var trans = 4000 // transition speed

//Create SVG element
const svg = d3.select("#anim").append("svg")
.attr("width", w + margin.left + margin.right)
.attr("height", h + margin.top + margin.bottom)
.attr("fill", "#f2f3f4")
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Adding scales
var xScale = d3.scaleBand()
.domain(d3.range(dataset.length)) // range(dataset.length) returns sequence of index numbers of dataset
.range([0, w]) // 'calculate even bands from 0 to width of SVG'
.round(true) // <-- Enable rounding
.paddingInner(0.05);

var yScale = d3.scaleLinear()
.domain([d3.max(dataset),0])
.range([0, h]);

var yAxis = d3.axisLeft()
.scale(yScale)
.tickFormat("")
.tickSize(0);


// Show the axis that corresponds to this scale
svg.append("g")
.attr("id", "y-axis")
.call(yAxis)
.attr("color", "#181b22"); // y-axis set to background color!

// Creating rectangular elements ('rects'), i.e. bars
svg.selectAll("rect")
.data(dataset)
.enter()
.append("rect")
.attr("x", function(d, i) { return i * (w / dataset.length); })
// above sets x-values as function of dataset length and width of SVG
.attr("y", function(d) { return h - d * 4; }) //Height minus data value; to draw bottom up
.attr("width", xScale.bandwidth())
.attr("height", function(d) { return d * 4; }) // times four to make bars larger
.attr("fill", "#f2f3f4")


// d3.select("p")
// .on("click", function() {
function loop() {

//New values for dataset
var numValues = dataset.length; //Count original length of dataset
var maxValue = 90 // sets maximum value
dataset = []; //Initialize empty array
for (var i = 0; i < numValues; i++) { //Loop numValues times
var newNumbers = Math.floor(Math.random() * maxValue); //
dataset.push(newNumbers); //Add new number to array
};

//Update scale domain
yScale.domain([d3.max(dataset),0]);

svg.selectAll("rect")
.data(dataset) // appends new dataset
.transition() // INDUCES TRANSITION!!
.delay(function(d, i) { // sets delay for each bar individually
return i * 100; })
.duration(3000) // sets duration of transition (in milliseconds)
.ease(d3.easeCubicInOut)
.attr("y", function(d) { return h - yScale(d); }) // updates y-position
.attr("height", function(d) { return yScale(d); }) // updates height
// updates color

svg.select("#y-axis")
	.transition()
	.duration(trans)
	.ease(d3.easeCubicInOut)
	.call(yAxis);
// });

};

d3.interval(function() {
loop();
}, 3000);

}else{

console.log("The animation was mostly written by ChatGPT.")

// Scatter plot dimensions and margins
var win_w = window.innerWidth
var win_h = window.innerHeight
const margin = {top: 90, right: 15, bottom: 20, left: 75};
const width = .2 * win_w// 400 - margin.left - margin.right;
const height = .33 * win_h// 300 - margin.top - margin.bottom;

// Append the svg object to the body of the page
//const svg = d3.select("svg")
const svg = d3.select("#anim").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("fill", "#f2f3f4")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Function to generate correlated data
function generateCorrelatedData(n, slope, intercept, noise) {
    return d3.range(n).map(() => {
        const x = Math.random();
        const y = slope * x + intercept + d3.randomNormal(0, noise)();
        return {x: x, y: y};
    });
}

// Generate correlated data
let data = generateCorrelatedData(50, 0.8, 0.1, 0.05);

// Set the scales
let x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x))
    .range([0, width]);

let y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.y))
    .range([height, 0]);

// Add the X Axis
const xAxis = svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat("").tickSize(0))
    .attr("class","axis");

// Add the Y Axis
const yAxis = svg.append("g")
    .call(d3.axisLeft(y).tickFormat("").tickSize(0))
    .attr("class","axis");

// Add the scatter dots
const dots = svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "scatter-dot")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", 5);

// Function to compute the OLS regression line
function olsLine(data) {
    const xMean = d3.mean(data, d => d.x);
    const yMean = d3.mean(data, d => d.y);
    const slope = d3.sum(data, d => (d.x - xMean) * (d.y - yMean)) / d3.sum(data, d => (d.x - xMean) ** 2);
    const intercept = yMean - slope * xMean;

    return [
        [d3.min(data, d => d.x), d3.min(data, d => d.x) * slope + intercept],
        [d3.max(data, d => d.x), d3.max(data, d => d.x) * slope + intercept]
    ];
}

// Add the OLS line
let olsData = olsLine(data);

const line = d3.line()
    .x(d => x(d[0]))
    .y(d => y(d[1]));

const olsPath = svg.append("path")
    .datum(olsData)
    .attr("class", "ols-line")
    .attr("d", line);

    const getRandomNumber = (min, max) => {
        return Math.random() * (max - min) + min
      }
      

// Animation function
function animateData() {

    var beta = getRandomNumber(-.8,.8)
    var alpha = getRandomNumber(.25,.75)
    data = generateCorrelatedData(50, beta, alpha, 0.05);

    // Update scales
    x.domain(d3.extent(data, d => d.x));
    y.domain(d3.extent(data, d => d.y));

    // Update axes
    xAxis.transition().duration(4000).call(d3.axisBottom(x).tickFormat("").tickSize(0));
    yAxis.transition().duration(4000).call(d3.axisLeft(y).tickFormat("").tickSize(0));

    // Update dots
    dots.data(data)
        .transition()
        .duration(4000)
        .ease(d3.easeCubicInOut)
        .attr("cx", d => x(d.x))
        .attr("cy", d => y(d.y));

    // Update OLS line
    olsData = olsLine(data);
    olsPath.datum(olsData)
        .transition()
        .duration(4000)
        .ease(d3.easeCubicInOut)
        .attr("d", line);
}

// Animate the scatter plot every 2 seconds
setInterval(animateData, 4000);

};


//Get the button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
