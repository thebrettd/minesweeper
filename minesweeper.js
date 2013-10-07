if (Meteor.isClient) {

    Template.main.gameStarted = function () {
        return Session.get("inProgress") == "TRUE";
    };

    Template.menu.events({
        'click input': function () {
            Session.set("inProgress", "TRUE");
            Session.set("gameOver", "FALSE");
            Session.set("numClicked", 0);
            Session.set("currentBoard", newBoard());
        }
    });

    Template.board.events({
        'click input.menu': function () {
            Session.set("inProgress", "FALSE");
        },
        'click input.cheat': function () {
            tempRevealBombs();
        },
        'click input.validate': function () {
            if (Session.get("numClicked") == 54){
                window.alert("You win!");
            }
        }
    });

    //Compute the value to display in a square
    Template.board.square = function (squareNum) {
        var board = getCurrentBoard();
        if (board[squareNum] == 'X')
            return computeNumBombs(squareNum);
        else if (board[squareNum] == 'B' && Session.equals("gameOver","TRUE"))
            return 'B';
        else
            return ' ';
    };

    //Return the number of bombs which are touching cell i
    function computeNumBombs(i) {
        var adjacentBombCount = 0;
        var adjacentCellsList = computeAdjacentCellsList(i);
        var board = getCurrentBoard();

        for (var j = 0; j < adjacentCellsList.length; j++) {
            if (board[adjacentCellsList[j]] == "B") {
                adjacentBombCount++;
            }
        }

        return adjacentBombCount;
    }

    //Return a list of all of the cell numbers which are adjacent to i
    function computeAdjacentCellsList(i) {
        var adjacentCellsList = [];
        if (i - 9 >= 0 && !(i % 8 == 0)) {
            adjacentCellsList.push(i - 9);
        }
        if ((i - 8 >= 0)) {
            adjacentCellsList.push(i - 8);
        }
        if ((i - 7 >= 0) && !(((i+1) % 8) == 0)) {
            adjacentCellsList.push(i - 7);
        }
        if ((i - 1 >= 0) && !(i % 8 == 0)) {
            adjacentCellsList.push(i - 1);
        }
        if ((i + 1 < 64) && !(((i+1) % 8) == 0)) {
            adjacentCellsList.push(i + 1);
        }
        if (i + 7 < 64 && !(i % 8 == 0)) {
            adjacentCellsList.push(i + 7);
        }
        if (i + 8 < 64) {
            adjacentCellsList.push(i + 8);
        }
        if (i + 9 < 64 && !(((i+1) % 8) == 0)) {
            adjacentCellsList.push(i + 9);
        }
        return adjacentCellsList;
    }

    //"Click" all cells adjacent to squareNum which have not been clicked.
    //A click is indicated by placing an "X" in that cell in the board array.
    //If a cell is touching 0 bombs, also click all of its adjacent non-clicked cells.
    function clickAllAdjacent(squareNum) {
        var board = getCurrentBoard();
        var adjacentCellsList = computeAdjacentCellsList(squareNum);
        var clicked = 0;
        for (var j = 0; j < adjacentCellsList.length; j++) {
            if(board[adjacentCellsList[j]] != 'X'){ //Do not "click" cells which have already been clicked..
                board[adjacentCellsList[j]] = 'X';
                Session.set("numClicked", Session.get("numClicked") + 1);
                updateBoard(board);
                if (computeNumBombs(adjacentCellsList[j]) == 0){
                    clickAllAdjacent(adjacentCellsList[j]);
                }
            }
        }
    }

    Template.board.events({
        'click .square': function (evt) {
            if (Session.equals("gameOver","TRUE")) { //Do not allow any more clicking once a bomb has been clicked
                window.alert("Sorry, game over. Please return to Menu.");
            } else {
                var board = getCurrentBoard();
                var squareNum = evt.currentTarget.className.split(" ")[1];

                if (board[squareNum] == "B") {
                    window.alert("You clicked on a bomb, you lose :(");
                    Session.set("gameOver", "TRUE");
                } else {
                    board[squareNum] = 'X'; //Mark the cell as clicked.
                    Session.set("numClicked", Session.get("numClicked") + 1);
                    if (computeNumBombs(squareNum) == 0) {
                        clickAllAdjacent(squareNum);
                    }
                }
                //Update the board
                updateBoard(board);
            }
        }
    });

    function getCurrentBoard(){
        return Session.get("currentBoard");
    }

    function updateBoard(board){
        Session.set("currentBoard", board);
    }

    function newBoard() {
        var board = [];
        var bombsPlaced = 0;

        while (bombsPlaced < 10) {
            var possibleLocation = Math.floor(Math.random() * 64);
            if (board[possibleLocation] == null) {
                board[possibleLocation] = 'B';
                bombsPlaced++;
            }
        }
        return board;
    }

}

if (Meteor.isServer) {


}
