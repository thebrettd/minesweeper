if (Meteor.isClient) {

  Template.main.gameStarted = function() {
      return Session.get("inProgress") == "TRUE";
  };

  Template.menu.events({
    'click input' : function () {
      Session.set("inProgress", "TRUE");
      Session.set("currentBoard", newBoard());
    }
  });

    Template.board.events({
        'click input.menu' : function () {
            Session.set("inProgress", "FALSE");
        },
        'click input.cheat' : function () {
            console.log("Cheaters never win");
        },
        'click input.validate' : function () {
            console.log("Did I win?");
        }
    });

    Template.board.clicked = function(i){
        var board = Session.get("currentBoard");
        return board[i] == 'X';
    };

    Template.board.square = function(i){
        var board = Session.get("currentBoard");
        if (board[i] == 'X')
            return computeNumBombs(i);
        else
            return ' ';
    };

    function computeNumBombs(i){
        var adjacentBombCount = 0;
        var adjacentCellsList = computeAdjacentCellsList(i);
        var board = Session.get("currentBoard");

        for(var j=0;j<adjacentCellsList.length;j++){
            if (board[adjacentCellsList[j]] == "B"){
                adjacentBombCount++;
            }
        }

        return adjacentBombCount;
    }

    function computeAdjacentCellsList(i){
        var adjacentCellsList = [];
        if(i-9 >= 0){
            adjacentCellsList.push(i-9);
        }
        if(i-8 >= 0){
            adjacentCellsList.push(i-8);
        }
        if(i-7 >= 0){
            adjacentCellsList.push(i-7);
        }
        if(i-1 >= 0){
            adjacentCellsList.push(i-1);
        }
        if(i+1 < 64){
            adjacentCellsList.push(i+1);
        }
        if(i+7 < 64){
            adjacentCellsList.push(i+7);
        }
        if(i+8 < 64){
            adjacentCellsList.push(i+8);
        }
        if(i+9 < 64){
            adjacentCellsList.push(i+9);
        }
        return adjacentCellsList;
    }

    Template.board.events({
        'click .square': function (evt) {
            var board = Session.get("currentBoard");
            var squareNum = evt.currentTarget.className.split(" ")[1];
            console.log("squareNum: " + squareNum);

            if (board[squareNum] == "B"){
                Session.set("gameOver", "TRUE");
            }else{
                board[squareNum] = 'X';

            }
            //Update the board
            Session.set("currentBoard", board);

        }
    });

    function newBoard() {
        var board = [];
        var bombsPlaced = 0;

        while(bombsPlaced < 10){
            var possibleLocation = Math.floor(Math.random()*64);
            if (board[possibleLocation] == null){
                board[possibleLocation] = 'B';
                bombsPlaced++;
            }
        }
        return board;
    }

}

if (Meteor.isServer) {


}
