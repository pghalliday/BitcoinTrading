var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

function timeSeriesChart() {
  var time, value, label;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) { return x(time(d)); })
      .y(function(d) { return y(value(d)); });

  function chart(selection) {
    selection.each(function(d, i) {
      x.domain(d3.extent(d, function(d) { return time(d); }));
      y.domain(d3.extent(d, function(d) { return value(d); }));

      var svg = selection.append('svg')
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(label);

      svg.append("path")
          .datum(d)
          .attr("class", "line")
          .attr("d", line);
    });
  };

  chart.time  = function(callback) {
    time = callback;
    return chart;
  }

  chart.value  = function(callback) {
    value = callback;
    return chart;
  }

  chart.label = function(text) {
    label = text;
    return chart;
  }

  return chart;
}

if (Meteor.isClient) {
  Template.chart.rendered = function () {
    d3.json('trades.json', function(trades) {
      var chart = timeSeriesChart()
        .time(function(d) { return new Date(d.date * 1000); })
        .value(function(d) { return parseFloat(d.price); })
        .label('Euros');

      d3.select(".chart-wrapper")
        .datum(trades)
        .call(chart);
    });
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
