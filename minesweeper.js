if (Meteor.isClient) {

  Template.main.gameStarted = function() {
      return Session.get("in_progress") == "TRUE";
  };

  Template.menu.events({
    'click input' : function () {
      Session.set("in_progress", "TRUE");
    }
  });

    Template.board.events({
        'click input' : function () {
            Session.set("in_progress", "FALSE");
        }
    });

    Template.board.events({
        'click .square': function (evt) {
            console.log("Clicked square");
        }
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
