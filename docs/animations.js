//////////////////////////////////////////////////////////////////
// Continuously updating bar chart & hovering 'back to top' button
//////////////////////////////////////////////////////////////////

// Carlo Knotz

// Credit belongs to:
 // Scott Murray's book 'Interactive Data Visualization for the Web'
 // d3noob (https://bl.ocks.org/d3noob/bf44061b1d443f455b3f857f82721372)
 // https://www.w3schools.com/howto/howto_js_scroll_to_top.asp

console.log("Hello there!")
var dataset = [ 5, 10, 13, 43, 23, 25, 22, 18, 15, 13,
                    11, 34, 15, 16, 18, 45, 16, 18, 23, 25 ];

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
.tickFormat("");


// Show the axis that corresponds to this scale
svg.append("g")
.attr("id", "y-axis")
.call(yAxis)
.attr("color", "#f2f3f4");

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
