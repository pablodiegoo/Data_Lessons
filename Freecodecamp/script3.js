// Objective: Build an app that is functionally similar to this: https://heat-map.freecodecamp.rocks.
// Fulfill the below user stories and get all of the tests to pass. Use whichever libraries or APIs you need. Give it your own personal style.
// You can use HTML, JavaScript, CSS, and the D3 svg-based visualization library. Required DOM elements are queried on the moment of each test. If you use a frontend framework (like Vue for example), the test results may be inaccurate for dynamic content. We hope to accommodate them eventually, but these frameworks are not currently supported for D3 projects.
// User Story #1: My heat map should have a title with a corresponding id="title".
// User Story #2: My heat map should have a description with a corresponding id="description".
// User Story #3: My heat map should have an x-axis with a corresponding id="x-axis".
// User Story #4: My heat map should have a y-axis with a corresponding id="y-axis".
// User Story #5: My heat map should have rect elements with a class="cell" that represent the data.
// User Story #6: There should be at least 4 different fill colors used for the cells.
// User Story #7: Each cell will have the properties data-month, data-year, data-temp containing their corresponding month, year, and temperature values.
// User Story #8: The data-month, data-year of each cell should be within the range of the data.
// User Story #9: My heat map should have cells that align with the corresponding month on the y-axis.
// User Story #10: My heat map should have cells that align with the corresponding year on the x-axis.
// User Story #11: My heat map should have multiple tick labels on the y-axis with the full month name.
// User Story #12: My heat map should have multiple tick labels on the x-axis with the years between 1754 and 2015.
// User Story #13: My heat map should have a legend with a corresponding id="legend".
// User Story #14: My legend should contain rect elements.
// User Story #15: The rect elements in the legend should use at least 4 different fill colors.
// User Story #16: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.
// User Story #17: My tooltip should have a data-year property that corresponds to the data-year of the active area.
// Here is the dataset you will need to complete this project: https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json
// You can build your project by using this CodePen template and clicking Save to create your own pen. Or you can use this CDN link to run the tests in any environment you like: https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js
// Once you're done, submit the URL to your working project with all its tests passing.

var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.select("#title")
  .html("<h1>Heat Map of Global Temperature</h1>");
d3.select("#description")
  .html("<h3>Monthly Land-Surface Temperature from 1753 - 2015</h3>");
d3.json(url).then(function(data) {
  dataset = data;
  var baseTemp = dataset.baseTemperature;
  var monthlyVariance = dataset.monthlyVariance;
  var years = monthlyVariance.map(function(item) {return item.year;});
  var xMax = d3.max(years);
  var xMin = d3.min(years);
  var xScale = d3.scaleLinear()
                 .domain([xMin, xMax])
                 .range([0, 800]);
  var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
  var svg = d3.select("#canva")
              .append("svg")
              .attr("width", 900)
              .attr("height", 600);
  svg.append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(70, 500)");
  var months = monthlyVariance.map(function(item) {return item.month;});
  var yMax = d3.max(months);
  var yMin = d3.min(months);
  var yScale = d3.scaleLinear()
                 .domain([yMax, yMin])
                 .range([0, 450]);
  var yAxis = d3.axisLeft().scale(yScale).tickFormat(function(d) {
    var date = new Date(0);
    date.setUTCMonth(d);
    return d3.timeFormat("%B")(date);
  });
  svg.append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(60, 20)");
  d3.select("#legend")
    // distance between legend and the canvas must be 30px
    .style("top", function() {return (document.getElementById("canva").offsetHeight + document.getElementById("title").offsetHeight + document.getElementById("description").offsetHeight + 170) + "px";})    
    .html("<h3>Temperature</h3>")
    .append("svg")
    .attr("width", 300)
    .attr("height", 50)
    .attr("id", "legend-axis")
    .append("g");
  var legendScale = d3.scaleLinear()
                      .domain([0, 4])
                      .range([0, 300]);
  var legendAxis = d3.axisBottom().scale(legendScale).tickFormat(function(d) {
    if (d === 0) {
      return "";
    } else if (d === 1) {
      return "2";
    } else if (d === 2) {
      return "4";
    } else if (d === 3) {
      return "6";
    } else {
      return "";
    }
  }
  );
  d3.select("#legend-axis")
    .call(legendAxis)
    .style("font-size", "15px")
    .style("color","#ccc")
    .attr("transform", "translate(0, -20)");
  d3.select("#legend-axis")
    .selectAll("rect")
    .data([0, 1, 2, 3])
    .enter()
    .append("rect")
    .attr("x", function(d) {return d * 75;})
    .attr("y", 30)
    .attr("width", 75)
    .attr("height", 20)
    .style("padding-bottom",10)
    .attr("fill", function(d) {
      if (d === 0) {
        return "blue";
      } else if (d === 1) {
        return "lightblue";
      } else if (d === 2) {
        return "orange";
      } else {
        return "red";
      }
    });
  svg.selectAll("rect")
.data(monthlyVariance)
.enter()
.append("rect")
.attr("class", "cell")
.attr("data-month", function(d) {return d.month - 1;})
.attr("data-year", function(d) {return d.year;})
.attr("data-temp", function(d) {return d.variance;})
.attr("x", function(d) {return xScale(d.year) - 0.1;})
.attr("y", function(d) {return yScale(d.month - 0.75);})
.attr("width", function(d) {return xScale(d.year + 1) - xScale(d.year);})
.attr("height", 30)
.attr("fill", function(d) {
  if (d.variance <= -2) {
    return "blue";
  } else if (d.variance <= 0) {
    return "lightblue";
  } else if (d.variance <= 2) {
    return "orange";
  } else {
    return "red";
  }
})
.attr("transform", "translate(70, -20)")
.on("mouseover", function(d) {
  d3.select('#tooltip')
    .style("opacity", 1)
    .attr("data-year", d.year)
    .style("top", (d3.event.pageY - 10) + "px")
    .style("left", (d3.event.pageX + 10) + "px")
    .style("transform", "translate(0, -100%)")
    .html(d.year+" - "+d.month+": "+(baseTemp + d.variance).toFixed(2)+"℃");
})
.on("mouseout", function(d) {
  d3.select('#tooltip')
    .style("opacity", 0)
});
}
);
