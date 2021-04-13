//SVG dimension and position

var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//import data
d3.csv("D3_data_journalism/assets/data/data.csv")
.then(function(acsData) {
acsData.forEach(function(data) {
  data.poverty = +data.poverty;
  data.age = +data.age;
  data.income = +data.income;
  data.healthcare = +data.healthcare;
  data.obesity = +data.obesity;
  data.smokes = +data.smokes;
});
});

//SVG wrapper and hold it to top left of the screen
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {

  console.log(censusData)
        // Step 1: Parse Data/Cast as numbers
        censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;

    });

  });