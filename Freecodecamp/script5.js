// Visualize Data with a Treemap Diagram
// Objective: Build an app that is functionally similar to this: https://treemap-diagram.freecodecamp.rocks.
// Fulfill the below user stories and get all of the tests to pass. Use whichever libraries or APIs you need. Give it your own personal style.
// You can use HTML, JavaScript, CSS, and the D3 svg-based visualization library. The tests require axes to be generated using the D3 axis property, which automatically generates ticks along the axis. These ticks are required for passing the D3 tests because their positions are used to determine alignment of graphed elements. You will find information about generating axes at https://github.com/d3/d3/blob/master/API.md#axes-d3-axis. Required DOM elements are queried on the moment of each test. If you use a frontend framework (like Vue for example), the test results may be inaccurate for dynamic content. We hope to accommodate them eventually, but these frameworks are not currently supported for D3 projects.
// User Story #1: My tree map should have a title with a corresponding id="title".
// User Story #2: My tree map should have a description with a corresponding id="description".
// User Story #3: My tree map should have rect elements with a corresponding class="tile" that represent the data.
// User Story #4: There should be at least 2 different fill colors used for the tiles.
// User Story #5: Each tile should have the properties data-name, data-category, and data-value containing their corresponding name, category, and value.
// User Story #6: The area of each tile should correspond to the data-value amount: tiles with a larger data-value should have a bigger area.
// User Story #7: My tree map should have a legend with corresponding id="legend".
// User Story #8: My legend should have rect elements with a corresponding class="legend-item".
// User Story #9: The rect elements in the legend should use at least 2 different fill colors.
// User Story #10: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.
// User Story #11: My tooltip should have a data-value property that corresponds to the data-value of the active area.
// For this project you can use any of the following datasets:
// Kickstarter Pledges: https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json
// Movie Sales: https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json
// Video Game Sales: https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json
// You can build your project by using this CodePen template and clicking Save to create your own pen. Or you can use this CDN link to run the tests in any environment you like: https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js
// Once you're done, submit the URL to your working project with all its tests passing.

d3.select("body")
  .append("div")
  .attr("id", "title")
  .text("Video Game Sales");
d3.select("body")
  .append("div")
  .attr("id", "description")
  .text("Top 100 Most Sold Video Games Grouped by Platform");
d3.select("body")
  .append("div")
  .attr("id", "canva");
d3.select("body")
  .append("div")
  .attr("id", "tooltip");
d3.select("body")
  .append("div")
  .attr("id", "legend");

var dt_games = {
    url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
    title: "Video Game Sales",
    desc: "Top 100 Video Games by Platform",
    cat: "Platform",
    info: "Sales"
  };
var dt_movies = {
  url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
  title: "Movie Sales",
  desc: "Top 100 Movies By Genre",
  cat: "Genre",
  info: "Revenue"
  };

var dt_kick = {
  url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
  title: "Kickstarter Pledges",
  desc: "Top 100 Campaigns By Category",
  cat: "Category",
  info: "Pledged"
  };
  
  var dt = dt_games;

const width = 900;
const height = 500;

const svg = d3.select("#canva")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("#tooltip");

const treemap = d3.treemap()
  .size([width, height]);

const format = d3.format(",d");

const legend = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", 50)
  .attr("id", "legend");

const colorCategory = d3.scaleOrdinal(d3.schemeCategory10);

const color = d3.scaleOrdinal()

const fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); };

const colorLegend = d3.scaleOrdinal(d3.schemeCategory10.map(fader)); 

const tooltipMouseover = function(d) {
  tooltip.style("opacity", 1)
    .style("left", (d3.event.pageX + 10) + "px")
    .style("top", (d3.event.pageY - 28) + "px")
    .attr("data-value", d.data.value)
    .html(
      "Name: " + d.data.name + 
      "<br>Category: " + d.data.category + 
      "<br>Value: " + d.data.value
    );
}

const tooltipMouseout = function(d) {
  tooltip.style("opacity", 0);
}

const sumCategoryData = function(d) {
  return d3.sum(d.children, function(d) {
    return d.value;
  });
}

const returnCategory = function(d) {
  // return unique category items
  return (d.data.category);
}

const legendMouseover = function(d) {
  tooltip.style("opacity", 1)
    .style("left", (d3.event.pageX + 10) + "px")
    .style("top", (d3.event.pageY - 28) + "px")
    // sum the data from entire category items
    .attr("data-value", sumCategoryData(d))
    .html(
      "Category: " + d.data.category + 
      "<br>Value: " + sumCategoryData(d)
    );
}

const legendMouseout = function(d) {
  tooltip.style("opacity", 0);
}

d3.json(dt.url).then(function(data) {
  var base = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value);
  treemap(base);
  const cell = svg.selectAll("g")
    .data(base.leaves())
    .enter()
    .append("g")
    .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")");
  cell.append("rect")
    .attr("class", "tile")
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("fill", d => colorCategory(d.data.category))
    .on("mouseover", tooltipMouseover)
    .on("mouseout", tooltipMouseout);
  cell.append("text")
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append("tspan")
    .attr("x", 4)
    .attr("y", (d, i) => 13 + i * 10)
    .attr("font-size", "10px")
    .attr("font-family", "sans-serif")
    .attr("fill", "black")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .text(d => d);
  const legendItem = legend.selectAll("g")
    .data(base.leaves().map(returnCategory).filter((item, index, self) => self.indexOf(item) === index))
    .enter()
    .append("g")
    // break in rows according the width of the svg
    .attr ("transform", (d, i) => "translate(" + (i * 65) + ", 0)")
    .on("mouseover", legendMouseover)
    .on("mouseout", legendMouseout);
  legendItem.append("rect")
    .attr("class", "legend-item")
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", d => colorCategory(d));
  legendItem.append("text")
    .attr("x", 25)
    .attr("y", 15)
    .text(d => d);
}
);