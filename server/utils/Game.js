const GeneratePositions = require("./generateMoveable");
const GeneratePlayers = require("./generatePlayers");
const GenerateBoard = require("./generateBoard");

class Game {
  constructor() {
    this.players = {};
    this.gameStarted = false;
    this.currentTurn = 0;
    this.turnNumber = 1;
    this.playerCount = 0;
    this.boardSize = 5;
    this.pieceCount = 8;
    this.board = [];

    // Funcs
    this.board = GenerateBoard.generateBoard(this.boardSize);
    GeneratePositions.generateMoveablePositions(this.board, this.boardSize);
    GeneratePlayers.addPlayers(this.board, this.boardSize);
  }
}

module.exports = Game;
