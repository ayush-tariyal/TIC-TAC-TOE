// Defining JS variables for board, human player and ai
let originalBoard;
const humanPlayer = "O";
const ai = "X";

// Possible winning combos
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

// The 'cells' variable is going to store a reference to each cell from index.html
const cells = document.querySelectorAll(".cell");

// This function will start the game
startGame();

function startGame() {
  // This will set the display property to none
  document.querySelector(".endgame").style.display = "none";

  // This will create an array with 9 elements and only get the 'keys' of those elements
  originalBoard = Array.from(Array(9).keys());

  // It will remove 'X's and 'O's, everytime we restart the game
  for (let element of cells) {
    element.innerText = "";
    element.style.removeProperty("background-color");
    element.addEventListener("click", turnClick, false);
  }
}

// This will return the 'id' of the cell when cliced on it
function turnClick(square) {
  // The 'if' condition will check if the 'originalBoard' array consists of number. This will prevent to click on the same cell by both human and ai
  if (typeof originalBoard[square.target.id] == "number") {
    turn(square.target.id, humanPlayer);

    // Before ai takes a turn, we are gonna check if it is a tie
    if (!checkTie()) turn(bestSpot(), ai);
  }
}

// The 'turn' function can be called either by human or ai
function turn(squareId, player) {
  // It is going to set the 'originalBoard' array at the 'id' that we clicked to 'player'
  originalBoard[squareId] = player;

  // This will update the display on that particular 'cell' where we clicked
  document.getElementById(squareId).innerText = player;
  document.getElementById(squareId).style.color = "#f1faee";

  // Whenever a turn is taken, we are going to check if the game has been won
  let gameWon = checkWin(originalBoard, player);

  // If the game has been won, it will call the 'gameOver' function
  if (gameWon) gameOver(gameWon);
}

// This function will check for the winning combination
function checkWin(board, player) {
  // This will return an array of all the places on the board which is already played-in
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;

  // Checking if the game has already been won
  // The 'for' loop will loop through every possible win combo
  for (let [index, win] of winCombos.entries()) {
    // This will check if every element in 'win' array consists of winning combo
    if (win.every((element) => plays.indexOf(element) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

// 'gameOver' function will declare the results
function gameOver(gameWon) {
  // The 'for' loop will go through every index of the winning combo
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == humanPlayer ? "#0077b6" : "#f94144";
    document.getElementById(index).style.borderRadius = "6px";
  }

  // This will remove the 'eventListener' from the cells so that no one can click on them
  for (let element of cells) {
    element.removeEventListener("click", turnClick, false);
  }

  declareWinner(gameWon.player == humanPlayer ? "You Win!!" : "You Lose");
}

// This function will display the results on the screen
function declareWinner(who) {
  document.querySelector(".endgame").style.display = "flex";
  document.querySelector(".endgame .text").innerHTML = who;
}

// This function will return an array with empty cells. All the square which are numbered are empty
function emptySquares() {
  return originalBoard.filter((s) => typeof s == "number");
}

// This function will return the best spot for the ai
function bestSpot() {
  return minimax(originalBoard, ai).index;
}

// This function will check if the game has been tied
function checkTie() {
  if (emptySquares().length == 0) {
    for (let element of cells) {
      element.style.backgroundColor = "#76c893";
      element.style.borderRadius = "6px";
      element.removeEventListener("click", turnClick, false);
    }

    declareWinner("Game Tied!!");
    return true;
  }
  return false;
}

// The 'minimax' function will return an object using minimax algorithm
function minimax(newBoard, player) {
  let availableSpots = emptySquares(newBoard);

  // We will check for terminal states meaning if someone is winning

  // If 'O' wins return -10, if 'X' wins return 10, else return 0
  if (checkWin(newBoard, player)) {
    return { score: -10 };
  } else if (checkWin(newBoard, ai)) {
    return { score: 10 };
  } else if (availableSpots.length === 0) {
    return { score: 0 };
  }

  // You need to collect the 'score' from each of the empty spots to evaluate later
  let moves = [];

  // This will loop through empty spots while collecting each move's index
  for (let i = 0; i < availableSpots.length; i++) {
    let move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player == ai) {
      let result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, ai);
      move.score = result.score;
    }

    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  }

  // 'minimax' algorithm will evaluate the best move in the 'moves' array
  let bestMove;

  // it should choose the move with highest score when ai is playing and the move with lowest score when human is playing
  if (player === ai) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
