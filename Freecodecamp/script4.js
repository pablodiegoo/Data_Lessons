// Visualize Data with a Choropleth Map
// Objective: Build an app that is functionally similar to this: https://choropleth-map.freecodecamp.rocks.
// Fulfill the below user stories and get all of the tests to pass. Use whichever libraries or APIs you need. Give it your own personal style.
// You can use HTML, JavaScript, CSS, and the D3 svg-based visualization library. Required DOM elements are queried on the moment of each test. If you use a frontend framework (like Vue for example), the test results may be inaccurate for dynamic content. We hope to accommodate them eventually, but these frameworks are not currently supported for D3 projects.
// User Story #1: My choropleth should have a title with a corresponding id="title".
// User Story #2: My choropleth should have a description element with a corresponding id="description".
// User Story #3: My choropleth should have counties with a corresponding class="county" that represent the data.
// User Story #4: There should be at least 4 different fill colors used for the counties.
// User Story #5: My counties should each have data-fips and data-education properties containing their corresponding fips and education values.
// User Story #6: My choropleth should have a county for each provided data point.
// User Story #7: The counties should have data-fips and data-education values that match the sample data.
// User Story #8: My choropleth should have a legend with a corresponding id="legend".
// User Story #9: There should be at least 4 different fill colors used for the legend.
// User Story #10: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.
// User Story #11: My tooltip should have a data-education property that corresponds to the data-education of the active area.
// Here are the datasets you will need to complete this project:
// US Education Data:https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json
// US County Data:https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json
// You can build your project by using this CodePen template and clicking Save to create your own pen. Or you can use this CDN link to run the tests in any environment you like: https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js
// Once you're done, submit the URL to your working project with all its tests passing.

d3.select('body')
  .append('h1')
  .attr('id', 'title')
  .text('EUA Educational Chart');
d3.select('body')
  .append('h3')
  .attr('id', 'description')
  .text('Percentage of Bachelor\'s degree or higher (2010-2014)');
d3.select('body')
  .append('div')
  .attr('id', 'canva');
d3.select('body')
  .append('div')
  .attr('id', 'tooltip');
d3.select('body')
  .append('div')
  .attr('id', 'legend');

var urlEducational = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
var urlGeo = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

d3.json(urlEducational).then(function(data) {
  dataset = data;
  var fips = dataset.map(function(item) {return item.fips;});
  var education = dataset.map(function(item) {return item.bachelorsOrHigher;});
  var xMax = d3.max(education);
  var xMin = d3.min(education);
  var xScale = d3.scaleLinear()
                 .domain([0, 80])
                 .range([0, 300]);
  var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
  var svg = d3.select('#canva')
              .append('svg')
              .attr("id", "mapSVG")
              .attr('width', 900)
              .attr('height', 500);
  d3.select("#legend")
    .append("svg")
    .attr("id", "legendSVG")
    .attr("width", 320)
    .attr("height", 100);
  d3.select("#legendSVG")
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, 50)");
  d3.select("#legendSVG")
    .append("text")
    .attr("id", "legendTitle")
    .attr("x", 150)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .text("Percentage of Bachelor's degree or higher")
    .style("font-weight", "bold")
    .style("fill", "#aaa");
  d3.select("#legendSVG")
    // make rects for the legends using warm colors
    .append("rect")
    .attr("x", 0)
    .attr("y", 70)
    .attr("width", 300/8)
    .attr("height", 20)
    .attr("fill", "#ff0000");
  d3.select("#legendSVG")
    .append("rect")
    .attr("x", 300/8)
    .attr("y", 70)
    .attr("width", 300/8)
    .attr("height", 20)
    .attr("fill", "#ff4000");
  d3.select("#legendSVG")
    .append("rect")
    .attr("x", 300*2/8)
    .attr("y", 70)
    .attr("width", 300/8)
    .attr("height", 20)
    .attr("fill", "#ff8000");
  d3.select("#legendSVG")
    .append("rect")
    .attr("x", 300*3/8)
    .attr("y", 70)
    .attr("width", 300/8)
    .attr("height", 20)
    .attr("fill", "#ffbf00");
  d3.select("#legendSVG")
    .append("rect")
    .attr("x", 300*4/8)
    .attr("y", 70)
    .attr("width", 300/8)
    .attr("height", 20)
    .attr("fill", "#ffff00");
  d3.select("#legendSVG")
    .append("rect")
    .attr("x", 300*5/8)
    .attr("y", 70)
    .attr("width", 300/8)
    .attr("height", 20)
    .attr("fill", "#bfff00");
  d3.select("#legendSVG")
    .append("rect")
    .attr("x", 300*6/8)
    .attr("y", 70)
    .attr("width", 300/8)
    .attr("height", 20)
    .attr("fill", "#80ff00");
  d3.select("#legendSVG")
    .append("rect")
    .attr("x", 300*7/8)
    .attr("y", 70)
    .attr("width", 300/8)
    .attr("height", 20)
    .attr("fill", "#40ff00");
  // Choropleth Map
  var path = d3.geoPath();

  var colorScale = d3.scaleLinear().domain([xMin, xMax]).range(["#ff0000", "#40ff00"]);

  d3.json(urlGeo).then(function(data) {
    if (data) {
      var geojson = topojson.feature(data, data.objects.counties).features;
      d3.json(urlEducational).then(function(data) {
        if (data) {
          var dataset = data;
          svg.selectAll("path")
             .data(geojson)
             .enter()
             .append("path")
             // make it smaller
             .attr("transform", "scale(0.82, 0.82) translate(100, 0)")
             .attr("d", path)
             .attr("class", "county")
             .attr("data-fips", function(item) {return item.id;})
             .attr("data-education", function(item) {
               var fips = item.id;
               var result = dataset.filter(function(item) {
                 return item.fips == fips;
               });
               return result[0].bachelorsOrHigher;
             })
             .attr("fill", function(item) {
               var fips = item.id;
               var result = dataset.filter(function(item) {
                 return item.fips == fips;
               });
               return colorScale(result[0].bachelorsOrHigher);
             })
             .on("mouseover", function(item) {
               var fips = item.id;
               var result = dataset.filter(function(item) {
                 return item.fips == fips;
               });
               d3.select("#tooltip")
                 .style("opacity", 1)
                 .style("left", d3.event.pageX + 10 + "px")
                 .style("top", d3.event.pageY + 10 + "px")
                 .attr("data-education", result[0].bachelorsOrHigher)
                 .html(result[0].area_name + ", " + result[0].state + ": " + result[0].bachelorsOrHigher + "%");
             })
             .on("mouseout", function(item) {
               d3.select("#tooltip")
                 .style("opacity", 0);
             });
        }
      });
    }
  }
  );
}
);