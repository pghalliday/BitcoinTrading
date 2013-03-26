if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to BitcoinTrading.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Template.chart.d3 = function () {
    return d3 ;
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
