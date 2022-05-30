function init() { // Grab a reference to the dropdown select element
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector.append("option").text(sample).property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        let firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

// Initialize the dashboard
init();

function optionChanged(newSample) { // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);

}

// Demographics Panel
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        let metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0];
        // Use d3 to select the panel with id of `#sample-metadata`
        let PANEL = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        PANEL.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${
                key.toUpperCase()
            }: ${value}`);
        });

    });
}

// 1. Create the buildCharts function.
function buildCharts(sample) { // 2. Use d3.json to load and retrieve the samples.json file
    d3.json("samples.json").then((data) => { // 3. Create a variable that holds the samples array.
        let samples = data.samples;
        console.log(samples);
        // 4. Create a variable that filters the samples for the object with the desired sample number.
        let sampleArray = samples.filter(allSamples => allSamples.id == sample);
        console.log(sampleArray);
        // 5. Create a variable that holds the first sample in the array.
        let firstSample = sampleArray[0];
        console.log(firstSample);

        // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        // fix this area of the code, figure out how to build and label each array
        let sampleIDs = firstSample.otu_ids;
        console.log(sampleIDs);

        let sampleLabels = firstSample.otu_labels;
        let labels = sampleLabels.slice(0, 10).reverse();
        console.log(labels);

        let sampleValues = firstSample.sample_values;
        let values = sampleValues.slice(0, 10).reverse();
        console.log(values);

        // 7. Create the yticks for the bar chart.
        // Hint: Get the the top 10 otu_ids and map them in descending order
        // so the otu_ids with the most bacteria are last.

        let top10 = sampleIDs.map(allSamples => "OTU " + allSamples).slice(0, 10).reverse();

        let yticks = top10.sort((a, b) => b - a);
        console.log(yticks);

        // 8. Create the trace for the bar chart.
        let barData = [{
                x: values,
                y: yticks,
                type: "bar",
                orientation: "h",
                text: labels
            }];

        // 9. Create the layout for the bar chart.
        let barLayout = {
            title: "Top 10 Bacteria Found",
            xaxis: {
                title: "# of Bacteria Present"
            },
            yaxis: {
                title: "Bacteria IDs"
            }
        };

        // 10. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bar", barData, barLayout);


        // Bubble Chart
        // 1. Create the trace for the bubble chart.
        let bubbleData = [{
                x: sampleIDs,
                y: sampleValues,
                text: sampleValues,
                mode: 'markers',
                marker: {
                    size: sampleValues,
                    color: sampleValues,
                    colorscale: 'Bluered'
                }
            }];

        // 2. Create the layout for the bubble chart.
        let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            xaxis: {
                title: "OTU ID"
            },
            automargin: true,
            width: 1200,
            hovermode: "closest"
        };

        // 3. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);


        // Gauge Chart
        // 1. Create a variable that filters the metadata array for the object with the desired sample number.
        let metadata = data.metadata;
        // Create a variable that holds the first sample in the array.
        let metaArray = metadata.filter(metaObj => metaObj.id == sample);

        // 2. Create a variable that holds the first sample in the metadata array.
        let meta = metaArray[0];

        // 3. Create a variable that holds the washing frequency.// 
        let x = meta.wfreq;

        let wfreq = parseFloat(x);

        //4. Create the trace for the gauge chart.
        let gaugeData = [{
            value: wfreq,
            type: "indicator",
            mode: "gauge+number",
            title: {text: "Washing Frequency Per Week"},
            gauge: {
                axis: {range: [null, 10], tickwidth: 2, tickcolor: "darkblue"},
                bar: {color: "darkblue"},
                bgcolor: "grey",
                borderwidth: 1,
                bordercolor: "black",
                steps: [
                    {range: [0,2], color: "red"},
                    {range: [2,4], color: "yellow"},
                    {range: [4,6], color: "darkorange"},
                    {range: [6,8], color: "lawngreen"},
                    {range: [8,10], color: "aqua"}
                ]
            }
        }];

        // 5. Create the layout for the gauge chart.
        let gaugeLayout = {
            automargin: true
        };

        // 6. Use Plotly to plot the gauge data and layout.
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);


    });
}
