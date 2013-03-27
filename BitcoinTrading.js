if (Meteor.isClient) {
  function transformTrades(trades) {
    var data = [{
      key: "Quantity",
      bar: true,
      values: []
    }, {
      key: "Price",
      values: []
    }];

    trades.forEach(function(trade) {
      data[0].values.push([new Date(trade.date * 1000), parseFloat(trade.amount)])
      data[1].values.push([new Date(trade.date * 1000), parseFloat(trade.price)])
    });

    return data;
  }
  
  Template.chart.rendered = function () {
    d3.json('trades.json', function(trades) {
      var data  = transformTrades(trades);
      nv.addGraph(function() {
        var chart = nv.models.linePlusBarChart()
              .margin({top: 30, right: 60, bottom: 50, left: 70})
              .x(function(d,i) { return i })
              .y(function(d) { return d[1] })
              .color(d3.scale.category10().range());

        chart.xAxis
          .showMaxMin(false)
          .tickFormat(function(d) {
            var dx = data[0].values[d] && data[0].values[d][0] || 0;
            return d3.time.format('%x')(new Date(dx))
          });

        chart.y1Axis
            .tickFormat(d3.format(',f'));

        chart.y2Axis
            .tickFormat(function(d) { return '$' + d3.format(',f')(d) });

        chart.bars.forceY([0]);

        d3.select('#chart svg')
          .datum(data)
          .transition().duration(500).call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
      });
    });
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
