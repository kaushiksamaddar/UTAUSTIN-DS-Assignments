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
  d3.json(`/metadata/${sample}`).then( metadata => {
    Object.entries(metadata).forEach( (entry) => {
      var para = metaSelector.append("p");
      para.text(`${entry[0]} : ${entry[1]}`);
    });
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  //Use `d3.json` to fetch the sample data for the plots
  console.log(`Build Charts for sample ${sample}`);

  d3.json(`/samples/${sample}`).then( sampleData => {

    console.log("Build a Bubble Chart on the Sample Data")

    var trace_bubble = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: 'markers',
      marker:{
        size:sampleData.sample_values,
        color:sampleData.otu_ids
      }
    }

    var data = [trace_bubble];

    var layout = {
      xaxis: {"title": "OTU ID"}
    };

    //Build a Bubble Chart using the sample data
    Plotly.newPlot('bubble', data, layout);

  });

  d3.json(`/samples/${sample}`).then(sampleData => {
    console.log("Build a Pie Chart on the Sample Data");

    var trace_pie = {
      labels : sampleData.otu_ids.slice(0, 10),
      values : sampleData.sample_values.slice(0, 10),
      hovertext : sampleData.otu_labels.slice(0, 10),
      type : "pie"
    };

    var data_pie = [trace_pie];

    //Build a Pie Chart using the sample data.
    Plotly.newPlot('pie', data_pie);


  });
  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text("BB_"+sample)
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
