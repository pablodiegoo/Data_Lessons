// Objective: Build an app that is functionally similar to this: https://bar-chart.freecodecamp.rocks.
// Fulfill the below user stories and get all of the tests to pass. Use whichever libraries or APIs you need. Give it your own personal style.
// You can use HTML, JavaScript, CSS, and the D3 svg-based visualization library. The tests require axes to be generated using the D3 axis property, which automatically generates ticks along the axis. These ticks are required for passing the D3 tests because their positions are used to determine alignment of graphed elements. You will find information about generating axes at https://github.com/d3/d3/blob/master/API.md#axes-d3-axis. Required DOM elements are queried on the moment of each test. If you use a frontend framework (like Vue for example), the test results may be inaccurate for dynamic content. We hope to accommodate them eventually, but these frameworks are not currently supported for D3 projects.
// User Story #1: My chart should have a title with a corresponding id="title".
// User Story #2: My chart should have a g element x-axis with a corresponding id="x-axis".
// User Story #3: My chart should have a g element y-axis with a corresponding id="y-axis".
// User Story #4: Both axes should contain multiple tick labels, each with a corresponding class="tick".
// User Story #5: My chart should have a rect element for each data point with a corresponding class="bar" displaying the data.
// User Story #6: Each .bar should have the properties data-date and data-gdp containing date and GDP values.
// User Story #7: The .bar elements' data-date properties should match the order of the provided data.
// User Story #8: The .bar elements' data-gdp properties should match the order of the provided data.
// User Story #9: Each .bar element's height should accurately represent the data's corresponding GDP.
// User Story #10: The data-date attribute and its corresponding .bar element should align with the corresponding value on the x-axis.
// User Story #11: The data-gdp attribute and its corresponding .bar element should align with the corresponding value on the y-axis.
// User Story #12: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.
// User Story #13: My tooltip should have a data-date property that corresponds to the data-date of the active area.
// Here is the dataset you will need to complete this project: 
// You can build your project by using this CodePen template and clicking Save to create your own pen. Or you can use this CDN link to run the tests in any environment you like: https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js.

var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

d3.json(url).then(function(data) {
  var dataset = data.data;
  var years = dataset.map(function(item) {return new Date(item[0]);});
  var xMax = new Date(d3.max(years));
  xMax.setMonth(xMax.getMonth() + 3);
  var xScale = d3.scaleTime()
                .domain([d3.min(years), xMax])
                .range([50, 900]);
  var xAxis = d3.axisBottom().scale(xScale);

  var svg = d3.select("#canva")
              .append("svg")
              .attr("width", 900)
              .attr("height", 600);
  svg.append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, 500)");
  var GDP = dataset.map(function(item) {
    return item[1];
  });
  var gdpMax = d3.max(GDP);
  var linearScale = d3.scaleLinear()
                      .domain([0, gdpMax])
                      .range([0, 500]);

  var scaledGDP = GDP.map(function(item) {
    return linearScale(item);
  });

  var yAxisScale = d3.scaleLinear()
                      .domain([0, gdpMax])
                      .range([500, 0]);
  var yAxis = d3.axisLeft(yAxisScale);
  svg.append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(50, 0)");

  d3.select("svg")
    .selectAll("rect")
    .data(scaledGDP)
    .enter()
    .append("rect")
    .attr("data-date", function(d, i) {return dataset[i][0];})
    .attr("data-gdp", function(d, i) {return dataset[i][1];})
    .attr("class", "bar")
    .attr("x", function(d, i) {return xScale(years[i]);})
    .attr("y", function(d, i) {return 500 - d;})
    .attr("width", 3)
    .attr("height", function(d) {return d;})
    .attr("fill", "navy")
    .attr("transform", "translate(0, 0)")
    .on("mouseover", function(d, i) {
      d3.select("#tooltip")
        .style("opacity", 1)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + 30 + "px")
        .attr("data-date", dataset[i][0])
        .html(dataset[i][0] + "<br>" + "$" + dataset[i][1] + " Billion");
    })
    
  })