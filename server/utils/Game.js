const BoardClass = require("./Board");

class Game {
  constructor(boardSize) {
    this.players = {};
    this.gameStarted = false;
    this.currentTurn = 0;
    this.turnNumber = 1;
    this.playerCount = 0;
    this.boardSize = boardSize;
    this.board = new BoardClass(boardSize);
  }
}

module.exports = Game;
