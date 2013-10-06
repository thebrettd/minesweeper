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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
