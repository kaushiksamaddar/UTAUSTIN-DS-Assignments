function buildMetadata(sample) {
  console.log(`Build Meta Data for sample: ${sample}`);
  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  var metaSelector = d3.select("#sample-metadata");
  // Use `.html("") to clear any existing metadata
  metaSelector.html("");
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  d3.json(`/metadata/${sample}`).then(metadata => {
    Object.entries(metadata).forEach((entry) => {
      var para = metaSelector.append("p");
      para.text(`${entry[0]} : ${entry[1]}`);
    });
  });
  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}

function buildBubbleCharts(sample){
  //Use `d3.json` to fetch the sample data for the plots
  console.log(`Build Charts for sample ${sample}`);

  d3.json(`/samples/${sample}`).then(sampleData => {

    console.log("Build a Bubble Chart on the Sample Data")

    var trace_bubble = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids
      }
    }

    var data = [trace_bubble];

    var layout = {
      xaxis: { "title": "OTU ID" }
    };

    //Build a Bubble Chart using the sample data
    Plotly.newPlot('bubble', data, layout);

  });

}

function buildPieCharts(sample){
  d3.json(`/samples/${sample}`).then(sampleData => {
    console.log("Build a Pie Chart on the Sample Data");

    var trace_pie = {
      labels: sampleData.otu_ids.slice(0, 10),
      values: sampleData.sample_values.slice(0, 10),
      hovertext: sampleData.otu_labels.slice(0, 10),
      type: "pie"
    };

    var data_pie = [trace_pie];

    //Build a Pie Chart using the sample data.
    Plotly.newPlot('pie', data_pie);
  });
}

//Construct the Gauge Chart out of the sample
function buildGaugeCharts(sample) {

  console.log("Build a Gauge Chart on the sample data.")
  // Use d3.json to fetch the frequency of the Sample.
  var level = 0;

  d3.json(`/wfreq/${sample}`).then(sampleData => {
    console.log(`Sample ${sampleData.sample} has a frequency of ${sampleData.WFREQ}`);
    level = sampleData.WFREQ * 20;
    console.log(`level is set to ${level}`);

    // Trig to calc meter point
    var degrees = 180 - level, radius = 0.5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = "M -.0 -0.025 L .0 0.025 L ",
      pathX = String(x),
      space = " ",
      pathY = String(y),
      pathEnd = " Z";
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data = [
      {
        type: "scatter",
        x: [0],
        y: [0],
        marker: { size: 28, color: "850000" },
        showlegend: false,
        name: "speed-marker",
        text: level,
        hoverinfo: "text+name"
      },
      {
        values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
        rotation: 90,
        text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        textinfo: "text",
        textposition: "inside",
        marker: {
          colors: [
            "rgba(14, 127, 0, .5)",
            "rgba(110, 154, 22, .5)",
            "rgba(170, 202, 42, .5)",
            "rgba(202, 209, 95, .5)",
            "rgba(210, 206, 145, .5)",
            "rgba(232, 226, 202, .5)",
            "rgba(242, 236, 212, .5)",
            "rgba(252, 246, 222, .5)",
            "rgba(262, 256, 232, .5)",
            "rgba(255, 255, 255, 0)"
          ]
        },
        labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1"],
        hoverinfo: "label",
        hole: 0.5,
        type: "pie",
        showlegend: false
      }
    ];

    var layout = {
      shapes: [
        {
          type: "path",
          path: path,
          fillcolor: "850000",
          line: {
            color: "850000"
          }
        }
      ],
      title: "<b>Gauge</b> <br> Speed 0-100",
      height: 500,
      width: 500,
      xaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      },
      yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      }
    };
    Plotly.newPlot("gauge", data, layout);
  });
}

function buildCharts(sample) {
  //Construct a Bubble Chart on the sample.
  buildBubbleCharts(sample);

  //Construct a Pie Chart on the sample.
  buildPieCharts(sample);

  //Construct a Gauge Chart on the sample.
  buildGaugeCharts(sample);
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text("BB_" + sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
