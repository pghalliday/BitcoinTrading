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

    var value = 0;
    var dayQuantity = [new Date(0), 0];
    var dayPrice = [new Date(0), 0];
    trades.forEach(function(trade) {
      // calculate the average daily price and total daily volume
      var date = new Date(trade.date * 1000);
      var day = new Date(0);
      day.setUTCFullYear(date.getUTCFullYear());
      day.setUTCMonth(date.getUTCMonth());
      day.setUTCDate(date.getUTCDate());

      if (day === dayVolume[0]) {
        dayQuantity[1] += trade.amount;
        value += (trade.amount * trade.price);
        dayPrice[1] = value / dayQuantity[1];
      } else {
        value = (trade.amount * trade.price);
        dayQuantity = [day, parseFloat(trade.amount)];
        dayPrice = [day, parseFloat(trade.price)];
        data[0].values.push(dayQuantity)
        data[1].values.push(dayPrice)
      }      
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
