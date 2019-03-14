// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth - 300;
  var svgHeight = window.innerHeight - 200;

  var margin = {
    top: 50,
    bottom: 50,
    right: 100,
    left: 100
  };

  var height = svgHeight - margin.top - margin.bottom - 50;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


  // Initial Params
  var chosenXAxis = "poverty";
  var chosenYAxis = "healthcare";

  // function used for updating x-scale var upon click on axis label
  function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);

    return xLinearScale;

  }

  // function used for updating y-scale var upon click on axis label
  function yScale(healthData, chosenYAxis) {
    // create scales
    console.log(`${chosenYAxis} min. - ${d3.min(healthData, d => d[chosenYAxis]) }`)
    console.log(`${chosenYAxis} max. - ${d3.max(healthData, d => d[chosenYAxis]) }`)

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.67,
      d3.max(healthData, d => d[chosenYAxis]) * 1.02
      ])
      .range([height, 0]);

    return yLinearScale;
  }

  // function used for updating xAxis var upon click on axis label
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return xAxis;
  }

  // function used for updating xAxis var upon click on axis label
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
      .duration(1000)
      .call(leftAxis);

    return yAxis;
  }

  // function used for updating circles group with a transition to
  // new circles
  function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
  }

  function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
  }

  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    // Step 1: Append tooltip div
    var toolTip = d3.select("body")
      .append("div")
      .classed("d3-tip", true);

    // Step 2: Create "mouseover" event listener to display tooltip
    circlesGroup
      .on("mouseover", function (healthData) {
        toolTip.style("display", "block")
          .html(
            `<strong>State: ${healthData.state}</strong><br>
           <strong>${chosenXAxis}: ${healthData[chosenXAxis]}</strong><br>
           <strong>${chosenYAxis}: ${healthData[chosenYAxis]} </strong>`
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
      })
      // Step 3: Create "mouseout" event listener to hide tooltip
      .on("mouseout", function () {
        toolTip.style("display", "none");
      });

    return circlesGroup;
  }

  //Function to update Text Labels
  function updateLabels(healthData, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis){
    chartGroup.append("text")
      .style("text-anchor", "middle")
      .style("font-size", "8px")
      .style("fill", "white")
      .selectAll("tspan")
      .data(healthData)
      .enter()
      .append("tspan")
      .attr("x", function (data) {
        return xLinearScale(data[chosenXAxis]);
      })
      .attr("y", function (data) {
        return yLinearScale(data[chosenYAxis] - 0.2);
      })
      .text(function (data) {
        return data.abbr
      });
  }

  //Function used to create X and Y Axes Labels
  function createLabels(x, y, value, activeinactive, text, labelGroup){
    return labelGroup.append("text")
      .attr("x", x)
      .attr("y", y)
      .attr("value", value) // value to grab for event listener
      .classed(activeinactive, true)
      .text(text);
  }

  // changes classes to change bold text on Y-Axis
  function boldAxisLabels(axis, chosenAxis, param1, param2, label1, label2, label3)
  {
      if (chosenAxis === param1) 
          {
            label1.classed("active", true).classed("inactive", false);
            label2.classed("active", false).classed("inactive", true);
            label3.classed("active", false).classed("inactive", true);
          }
          else if(chosenAxis === param2)
          {
            label1.classed("active", false).classed("inactive", true);
            label2.classed("active", true).classed("inactive", false);
            label3.classed("active", false).classed("inactive", true);
          }
          else
          {
            label1.classed("active", false).classed("inactive", true);
            label2.classed("active", false).classed("inactive", true);
            label3.classed("active", true).classed("inactive", false);
          }
  }

  // Read CSV
  d3.csv("assets/data/data.csv").then(function (healthData) {

    // parse data
    healthData.forEach(function (data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
    });

    //Create X and Y Scales
    var xLinearScale = xScale(healthData, chosenXAxis);
    var yLinearScale = yScale(healthData, chosenYAxis);

    // create axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axes
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
      .call(leftAxis);

    // append Initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", "10")
      .attr("fill", "lightblue")
      .attr("stroke-width", "0")

    // Create group for  3 x- axis labels
    var labelsXGroup = chartGroup.append("g").attr("transform", `translate(${width / 2}, ${height + 20})`);
    var povertyLabel = createLabels(0, 20, "poverty", "active", " In Poverty(%) ", labelsXGroup);
    var ageLabel = createLabels(0, 40, "age", "inactive", " Age (Median) ", labelsXGroup);
    var incomeLabel = createLabels(0, 60, "income", "inactive", " Household Income (Median)", labelsXGroup);

    //Create group for 3 y-axis labels
    var labelsYGroup = chartGroup.append("g").attr("transform", "rotate(-90)");
    var healthcareLabel = createLabels((0 - height / 2), (0 - margin.left + 70), "healthcare", "active", "Lacks Healthcare (%)", labelsYGroup);
    var smokesLabel = createLabels((0 - height / 2), (0 - margin.left + 50), "smokes", "inactive", "Smokes (%)", labelsYGroup);
    var obesseLabel = createLabels((0 - height / 2), (0 - margin.left + 30), "obesity", "inactive", "Obesse (%)", labelsYGroup);

    //Append a Text Label against all the circles
    updateLabels(healthData, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    //X-Axis Labels Event Listener
    labelsXGroup.selectAll("text")
      .on("click", function(){
        //Get the Value of the Selection
        var value = d3.select(this).attr("value");

        if(value !== chosenXAxis){

          //Replace chosen axis with value
          chosenXAxis = value;

          // updates x scale for new data
          xLinearScale = xScale(healthData, chosenXAxis);

          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);

          // updates circles with new x values
          circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          //Update the Labels
          updateLabels(healthData, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

          //Bold the X Axis Labels
          boldAxisLabels("xaxis", chosenXAxis, "poverty", "age", povertyLabel, ageLabel, incomeLabel);

        }

      });


    //Y-Axis Labels Event Listener
    labelsYGroup.selectAll("text")
      .on("click", function(){
        //Get the Value of the Selection
        var value = d3.select(this).attr("value");

        if(value !== chosenYAxis){

          //Replace chosen axis with value
          chosenYAxis = value;

          console.log(`Chosen Y Axis: ${chosenYAxis}`);

          // updates y scale for new data
          yLinearScale = yScale(healthData, chosenYAxis);

          // updates y axis with transition
          yAxis = renderYAxes(yLinearScale, yAxis);

          // updates circles with new y values
          circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          //Update the Labels
          updateLabels(healthData, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

          //Bold the Y Axis Labels
          boldAxisLabels("yaxis", chosenYAxis, "healthcare", "smokes", healthcareLabel, smokesLabel, obesseLabel);
        }

      });

  });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
