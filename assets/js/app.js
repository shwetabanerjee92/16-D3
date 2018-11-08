
// Creating svg container that will contain the scatter plot

var svgWidth = 900;
var svgHeight = 700;

var margin = {
    top: 50,
    right: 40,
    bottom: 100,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG container
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


// Append SVG group and place it with respect to the left and top margin
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data.csv

d3.csv("assets/data/data.csv").then(function (data) {
    console.log("data=>", data);

    // Function to visualize the imported data
    Visualize(data);
})


// Create Axes


function xScale(data) {

    // Create x-scale
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.poverty) * 0.8,
        d3.max(data, d => d.poverty) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;
}

function yScale(data) {
    // create y-scale
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.healthcare) * 0.8,
        d3.max(data, d => d.healthcare) * 1.2
        ])
        .range([height, 0]);

    return yLinearScale;
}

// define the visualize function
function Visualize(theData) {
    // parse through the csv data
    theData.forEach(function (data) {
        data.id = +data.id;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    //   Define LinearScale functions for x & y
    var xLinearScale = xScale(theData, theData.poverty);
    var yLinearScale = yScale(theData, theData.healthcare);



    // Create  the scaled X and Y axes the bottom and left of the chart
    var BottomAxis = d3.axisBottom(xLinearScale);
    var LeftAxis = d3.axisLeft(yLinearScale);

    // Append the x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(BottomAxis);

    // Append the y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(LeftAxis);


    //Create circles

    var theCircles = svg.selectAll("g theCircles").data(theData).enter();

    // Append points on scatter plot
    theCircles.append("circle")
        .attr("cx", function (d) {
            return xLinearScale(d.poverty);
        })
        .attr("cy", function (d) {
            return yLinearScale(d.healthcare);
        })
        .attr("r", 10)
        .attr("fill", "blue")
        .attr("opacity", ".4");



    theCircles.append("text").text(function (d) {
        return d.abbr;
    }).attr("dx", d => xLinearScale(d.poverty)).attr("dy", d => yLinearScale(d.healthcare))
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "7px");


    // Create Labels in the chartGroup to contain the texts for the x and y labels

    var xlabel = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var ylabel = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    //Append x-label for poverty 
    var povertyLabel = xlabel.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .text("In Poverty (%)")


    // Append y-label for lacks healthcare 
    var nohealthcareLabel = ylabel.append("text")
        .attr("x", 0 - (height / 2))
        .attr("y", 0 - margin.left + 20)
        .text("Lacks Healthcare (%)");


};


