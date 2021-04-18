// Data Journalism - D3

function makeResponsive() {

  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }
  
  var svgWidth = 800;
  var svgHeight = 500;

  var margin = {
    top: 20,
    right: 40,
    bottom: 90,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var Xaxis_sel = "poverty";
  var Yaxis_sel = "healthcare";

  function xScale(XsData, Xaxis_sel) {
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(XsData, d => d[Xaxis_sel]) * 0.8,
        d3.max(XsData, d => d[Xaxis_sel]) * 1.2
      ])
      .range([0, width]);
    return xLinearScale;
  }

  function yScale(XsData, Yaxis_sel) {
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(XsData, d => d[Yaxis_sel]) * 0.8,
        d3.max(XsData, d => d[Yaxis_sel]) * 1.2
      ])
      .range([height, 0]);
    return yLinearScale;
  }
  

  function renderCircles(circlesGroup, newXScale, Xaxis_sel, newYScale, Yaxis_sel) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[Xaxis_sel]))
      .attr("cy", d => newYScale(d[Yaxis_sel]));
    return circlesGroup;
  }


  function updateToolTip(Xaxis_sel, Yaxis_sel, circlesGroup, textGroup) {

    if (Xaxis_sel === "poverty") {
      var xLabel = "Poverty (%)";
        }
    else {
      var yLabel = "healthcare (%)";
    }

    
    var toolTip = d3.tip()
      .attr("class", "tooltip d3-tip")
      .offset([90, 90])
      .html(function(d) {
        return (`<strong>${d.abbr}</strong><br>${xLabel} ${d[Xaxis_sel]}<br>${yLabel} ${d[Yaxis_sel]}`);
      });
    
    circlesGroup.call(toolTip);
    
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
    
    textGroup.call(toolTip);
    textGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
    return circlesGroup;
  }

  d3.csv("assets/data/data.csv")
    .then(function(XsData) {
    XsData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });

    var xLinearScale = xScale(XsData, Xaxis_sel);
    var yLinearScale = yScale(XsData, Yaxis_sel);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

    var circlesGroup = chartGroup.selectAll(".stateCircle")
      .data(XsData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[Xaxis_sel]))
      .attr("cy", d => yLinearScale(d[Yaxis_sel]))
      .attr("class", "stateCircle")
      .attr("r", 15)
      .attr("opacity", ".75");

    var textGroup = chartGroup.selectAll(".stateText")
      .data(XsData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[Xaxis_sel]))
      .attr("y", d => yLinearScale(d[Yaxis_sel]*.98))
      .text(d => (d.abbr))
      .attr("class", "stateText")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("fill", "white");

    var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
    var povertyLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") 
      .classed("active", true)
      .text("Poverty (%)");

    var yLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(-25, ${height / 2})`);
    var healthcareLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .attr("x", 0)
      .attr("value", "healthcare")
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("active", true)
      .text("Lacks Healthcare (%)");

    var circlesGroup = updateToolTip(Xaxis_sel, Yaxis_sel, circlesGroup, textGroup);

    xLabelsGroup.selectAll("text")
      .on("click", function() {
        var value = d3.select(this).attr("value");
        if (value !== Xaxis_sel) {
          Xaxis_sel = value;
          xLinearScale = xScale(XsData, Xaxis_sel);
          xAxis = renderXAxes(xLinearScale, xAxis);
          textGroup = renderText(textGroup, xLinearScale, Xaxis_sel, yLinearScale, Yaxis_sel)
          circlesGroup = updateToolTip(Xaxis_sel, Yaxis_sel, circlesGroup, textGroup);
          if (Xaxis_sel === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
          }
           else {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      });
    
  
    yLabelsGroup.selectAll("text")
      .on("click", function() {
        
        var value = d3.select(this).attr("value");
        if (value !== Yaxis_sel) {
          Yaxis_sel = value;
          yLinearScale = yScale(XsData, Yaxis_sel);
          yAxis = renderYAxes(yLinearScale, yAxis);
          circlesGroup = renderCircles(circlesGroup, xLinearScale, Xaxis_sel, yLinearScale, Yaxis_sel);
          textGroup = renderText(textGroup, xLinearScale, Xaxis_sel, yLinearScale, Yaxis_sel)
          circlesGroup = updateToolTip(Xaxis_sel, Yaxis_sel, circlesGroup, textGroup);
          if (Yaxis_sel === "healthcare") {
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
          }
              else {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);

          }
        }
      });
  });
}

makeResponsive();


d3.select(window).on("resize", makeResponsive);