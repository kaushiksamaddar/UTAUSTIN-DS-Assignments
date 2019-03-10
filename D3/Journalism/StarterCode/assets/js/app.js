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
  var svgHeight = window.innerHeight - 300;

  var margin = {
    top: 50,
    bottom: 50,
    right: 100,
    left: 100
  };

  var height = svgHeight - margin.top - margin.bottom;
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

  // Read CSV
    d3.csv("assets/data/data.csv").then(function (healthData) {

    // parse data
    healthData.forEach(function (data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    xMin = d3.min(healthData, function (data) {
      return +data.poverty * 0.95;
    });

    xMax = d3.max(healthData, function (data) {
      return +data.poverty * 1.05;
    });

    yMin = d3.min(healthData, function (data) {
      return +data.healthcare * 0.67;
    });

    yMax = d3.max(healthData, function (data) {
      return +data.healthcare * 1.02;
    });

    // create scales
    var xLinearScale = d3.scaleLinear()
      //.domain(d3.extent(healthData, d => d.poverty))
      .domain([xMin, xMax])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      //.domain([0, d3.max(healthData, d => d.healthcare)])
      .domain([yMin, yMax])
      .range([height, 0]);

    // create axes
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale).ticks(6);

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "lightblue")
      .attr("stroke-width", "0")

    //Append a Text Label against all the circles
    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "8px")
        .style("fill", "white")
        .selectAll("tspan")
        .data(healthData)
        .enter()
        .append("tspan")
        .attr("x", function (data) {
            return xLinearScale(data.poverty);
        })
        .attr("y", function (data) {
            return yLinearScale(data.healthcare-0.2);
        })
        .text(function (data) {
            return data.abbr
        });

    // Step 1: Append tooltip div
    var toolTip = d3.select("body")
      .append("div")
      .classed("tooltip", true);

    // Step 2: Create "mouseover" event listener to display tooltip
    circlesGroup
    .on("mouseover", function (healthData) {
      toolTip.style("display", "block")
        .html(
          `<strong>State: ${healthData.state}</strong><br>
           <strong>Poverty: ${healthData.poverty}</strong><br>
           <strong>Health: ${healthData.healthcare} </strong>`
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    })
    // Step 3: Create "mouseout" event listener to hide tooltip
    .on("mouseout", function () {
      toolTip.style("display", "none");
    });

    // Append y-axis label
    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .attr("class", "axis-text")
        .text("Lacks Healthcare (%)")

    // Append x-axis labels
    chartGroup
        .append("text")
        .attr("transform", `translate(${width/2}, ${height + margin.top})`)
        .attr("class", "axis-text")
        .text("In Poverty(%)");

  });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
