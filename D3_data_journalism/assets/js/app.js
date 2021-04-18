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

//SVG wrapper and hold it to top left of the screen
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//import data
d3.csv("assets/data/data.csv")
.then(function(censusData) {
  console.log(censusData)
  censusData.forEach(function(data) {
  data.poverty = +data.poverty;
  data.age = +data.age;
  data.income = +data.income;
  data.healthcare = +data.healthcare;
  data.obesity = +data.obesity;
  data.smokes = +data.smokes;
});

//Scale Function
var xLinearScale = d3.scaleLinear()
.domain([6, d3.max(censusData, d => d.healthcare)])
.range([0, width]);

var yLinearScale = d3.scaleLinear()
.domain([4, d3.max(censusData, d => d.age)])
.range([height, 0]);


//Create and Append Axis
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

chartGroup.append("g")
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

chartGroup.append("g")
.call(leftAxis);

//Add Circles
var circlesGroup = chartGroup.selectAll("circle")
.data(censusData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.healthcare))
.attr("cy", d => yLinearScale(d.age))
.attr("r", "15")
.attr("fill", "#ECB55A");

//State Abbreviations
var stateAbbr = chartGroup.append("g").selectAll("text")
.data(censusData)
.enter()
.append("text")
.text(function(d) {return d.abbr;})
.attr("x", d => xLinearScale(d.poverty-0.25))
.attr("y", d => yLinearScale(d.smokes-0.25))
.attr("r", "15")
.attr("fill", "white");

//Setup Tool Tip
var toolTip = d3.tip()
.attr("class", "tooltip")
.offset([80, -60])
.html(function(data, index) {
  return (`${data.state}<br>Healthcare: ${data.healthcare} %<br>Age: ${data.age} %`);
});

    // Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    //  Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Age Rate (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Healthcare Rate (%)");
  }).catch(function(error) {
    console.log(error);
  });

  