if (Meteor.isClient) {

    Template.main.gameStarted = function () {
        return Session.equals("inProgress","TRUE");
    };

    Template.menu.events({
        'click input': function () {
            resetBoard();
        }
    });

    //Compute the value to display in a square
    Template.board.square = function (squareNum) {
        var board = getCurrentBoard();
        if (board[squareNum] == 'X')
            return Session.get("adjacentBombs")[squareNum];
        else if (board[squareNum] == 'B' && Session.equals("gameOver","TRUE"))
            return 'B';
        else
            return ' ';
    };

    Template.board.squareClass = function(squareNum){
        var board = getCurrentBoard();
        var isBomb = board[squareNum] == 'B';
        if (isBomb && Session.equals("cheatMode","TRUE"))
            return 'squareCheat ' + squareNum;
        else
            return 'square ' + squareNum;
    };

    Template.board.events({
        'click input.menu': function () {
            Session.set("inProgress", "FALSE");
        },
        'click input.cheat': function () {
            tempRevealBombs();
        },
        'click input.reset': function () {
            resetBoard();
        },
        'click input.validate': function () {
            if (Session.get("numClicked") == 54){
                window.alert("You win!");
                Session.set("gameOver", "TRUE");
            }else{
                window.alert("There are still " + (54 - Session.get("numClicked")) + " non-bomb squares remaining!");
            }
        },
        'click .square': function (evt) {
            var board = getCurrentBoard();
            var squareNum = parseInt(evt.currentTarget.className.split(" ")[1]);

            if (Session.equals("gameOver","TRUE")) { //Do not allow any more clicking once a bomb has been clicked
                window.alert("Sorry, game over. Please return to Menu or click Reset");
            } else if (board[squareNum] != 'X') { //Do nothing if this square already clicked
                if (board[squareNum] == "B") {
                    window.alert("You clicked on a bomb, you lose :(");
                    Session.set("gameOver", "TRUE");
                } else {
                    board[squareNum] = 'X'; //Mark the cell as clicked.
                    updateBoard(board);
                    Session.set("numClicked", Session.get("numClicked") + 1);
                    if (Session.get("adjacentBombs")[squareNum] == 0) {
                        clickAllAdjacent(squareNum,board);
                    }
                }
            }
        }
    });

    //Helpers

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

    function computeAdjacentBombs() {
        var adjacentBombs = [];

        for (var i=0;i<64;i++){
            adjacentBombs[i] = computeNumBombs(i, Session.get("currentBoard"));
        }

        return adjacentBombs;
    }

    //Return the number of bombs which are touching cell i
    function computeNumBombs(i, board) {
        var adjacentBombCount = 0;
        var adjacentCellsList = computeAdjacentCellsList(i);

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
        if (i - 9 >= 0 && !(isLeftmostColumn(i))) {
            adjacentCellsList.push(i - 9);
        }
        if ((i - 8 >= 0)) {
            adjacentCellsList.push(i - 8);
        }
        if ((i - 7 >= 0) && !(isRightmostColumn(i))) {
            adjacentCellsList.push(i - 7);
        }
        if ((i - 1 >= 0) && !(isLeftmostColumn(i))) {
            adjacentCellsList.push(i - 1);
        }
        if ((i + 1 < 64) && !(isRightmostColumn(i))) {
            adjacentCellsList.push(i + 1);
        }
        if (i + 7 < 64 && !(isLeftmostColumn(i))) {
            adjacentCellsList.push(i + 7);
        }
        if (i + 8 < 64) {
            adjacentCellsList.push(i + 8);
        }
        if (i + 9 < 64 && !(isRightmostColumn(i))) {
            adjacentCellsList.push(i + 9);
        }
        return adjacentCellsList;
    }

    function isLeftmostColumn(i){
        return (i % 8) === 0;
    }

    function isRightmostColumn(i){
        return ((i + 1) % 8) === 0;
    }

    //"Click" all cells adjacent to squareNum which have not been clicked.
    //A click is indicated by placing an "X" in that cell in the board array.
    //If a cell is touching 0 bombs, also click all of its adjacent non-clicked cells.
    function clickAllAdjacent(squareNum,board) {
        var adjacentCellsList = computeAdjacentCellsList(squareNum);
        for (var j = 0; j < adjacentCellsList.length; j++) {
            if(board[adjacentCellsList[j]] != 'X'){ //Do not "click" cells which have already been clicked..
                board[adjacentCellsList[j]] = 'X';
                updateBoard(board);
                Session.set("numClicked", Session.get("numClicked") + 1);
                if (Session.get("adjacentBombs")[adjacentCellsList[j]] == 0){
                    clickAllAdjacent(adjacentCellsList[j], board);
                }
            }
        }
    }

    function tempRevealBombs(){
        showBombs();
        Meteor.setTimeout(function () {
            hideBombs();
        },3000);

    }

    function showBombs() {
        window.alert("Cheaters never win.");
        Session.set("cheatMode", "TRUE");
        Deps.flush();
    }

    function hideBombs(){
        Session.set("cheatMode", "FALSE");
        Deps.flush();
    }


    function resetBoard() {
        Session.set("inProgress", "TRUE");
        Session.set("gameOver", "FALSE");
        Session.set("numClicked", 0);
        Session.set("currentBoard", newBoard());
        Session.set("adjacentBombs", computeAdjacentBombs());
        Session.set("cheatMode", "FALSE");
    }

}

if (Meteor.isServer) {


}
