"use strict";

// Reset a tile to an empty one..
exports.canMakeSelectedMove = (socket, rooms, tileFrom, tileTo) => {
  // Get current room from users..
  const previousState = { ...rooms[socket.currentRoom] };
  const tempState = { ...rooms[socket.currentRoom] };

  let canMakeMove = false;

  if (tempState.board[tileTo[0]][tileTo[1]].player === null) {
    // Check if it is a valid move..
    const currenty = tileFrom[0];
    const currentx = tileFrom[1];

    // Check the tiles saved possible moves to see if that is one we can do..
    canMakeMove = tempState.board[currenty][currentx].possibleMoves.some(
      (pos) => pos[0] === tileTo[0] && pos[1] === tileTo[1]
    );
  }

  if (canMakeMove) {
    movePlayerToNewSquare(tempState, tileTo[0], tileTo[1], tileFrom[0], tileFrom[1], socket);
    checkAllSandwichKill(tileTo[0], tileTo[1], tempState, socket);
    checkAllMiddleKill(tileTo[0], tileTo[1], tempState);
    checkBoardForDeaths(tempState);
    checkWinningCondition(tempState);

    // Change turn as we can make a move..
    tempState.currentTurn == 0 ? (tempState.currentTurn = 1) : (tempState.currentTurn = 0);

    // Keep track of the current turn number incase we implement character effects later..
    tempState.turnNumber++;

    rooms[socket.currentRoom] = tempState;
    return true;
  }

  if (!canMakeMove) {
    return false;
  }
};

// Move one player from one tile to another..
const movePlayerToNewSquare = (tempState, y, x, oldy, oldx, socket) => {
  tempState.board[y][x].player = tempState.currentTurn;
  tempState.board[y][x].attack = tempState.board[oldy][oldx].attack;
  tempState.board[y][x].health = tempState.board[oldy][oldx].health;
  tempState.board[y][x].rarity = tempState.board[oldy][oldx].rarity;
  tempState.board[y][x].img = tempState.board[oldy][oldx].img;

  tempState.board[oldy][oldx].player = null;
  tempState.board[oldy][oldx].attack = null;
  tempState.board[oldy][oldx].health = null;
  tempState.board[oldy][oldx].rarity = null;
  tempState.board[oldy][oldx].img = null;
};

const resetPlayerDataToEmpty = (tempGameState, y, x) => {
  tempGameState.board[y][x].player = null;
  tempGameState.board[y][x].attack = null;
  tempGameState.board[y][x].health = null;
  tempGameState.board[y][x].rarity = null;
  tempGameState.board[y][x].img = null;
};

// Check board for deaths after all calculations..
const checkBoardForDeaths = (tempGameState) => {
  tempGameState.board.map((rows) => {
    rows.map((tiles) => {
      if (tiles.health <= 0 && tiles.player !== null) {
        const ypos = tiles.position[0];
        const xpos = tiles.position[1];

        //? Remove a peice from the peice count - for win conditions!
        const currentCount = tempGameState.pieceCount[`${tempGameState.currentTurn === 0 ? 1 : 0}`];
        tempGameState.pieceCount[`${tempGameState.currentTurn === 0 ? 1 : 0}`] = currentCount - 1;
        resetPlayerDataToEmpty(tempGameState, ypos, xpos);
      }
    });
  });
};

const checkWinningCondition = (tempState) => {
  if (tempState.pieceCount["0"] <= 1) console.log("Player 2 is the winner");
  if (tempState.pieceCount["1"] <= 1) console.log("Player 1 is the winner");
};

//! Important.
// Check if tile being checked is outside the boundired..
const checkGreaterOrLessThan = (gameState, y, x) => {
  if (
    !(x >= 0) ||
    !(x <= gameState.boardSize - 1) ||
    !(y >= 0) ||
    !(y <= gameState.boardSize - 1) ||
    gameState.board[y][x].player === null
  ) {
    return false;
  }
};

// Check if there is an enemy in the middle and players either side..
const checkSandwichKill = (cy, cx, y, x, tempGameState) => {
  // Save check into variable, see if varaible is less than 0 -- Out of bounds
  const yCheck = cy + y;
  const xCheck = cx + x;

  // If tile being checked is not posible, return..
  if (checkGreaterOrLessThan(tempGameState, yCheck, xCheck) === false) return;

  // Check if one tile over is not current player, or an empty tile == enemy tile.
  if (
    tempGameState.board[yCheck][xCheck].player !== null &&
    tempGameState.board[yCheck][xCheck].player !== tempGameState.currentTurn
  ) {
    // Save check into variable, see if varaible is less than 0 -- Out of bounds
    const yCheckTwo = cy + y + y;
    const xCheckTwo = cx + x + x;

    // If tile being checked is not posible, return..
    if (checkGreaterOrLessThan(tempGameState, yCheckTwo, xCheckTwo) === false) return;

    // There is an enemy here so check the other side for friendly..
    if (tempGameState.board[yCheckTwo][xCheckTwo].player === tempGameState.currentTurn) {
      // Calculate the attack damage of the 2 attackers, divided by 2.
      const attackerOne = tempGameState.board[yCheckTwo][xCheckTwo].attack;
      const attackerTwo = tempGameState.board[cy][cx].attack;
      const totalAttack = attackerOne + attackerTwo / 2;

      // Take away the attack from the enemy HP
      const enemyHP = tempGameState.board[yCheck][xCheck].health;
      tempGameState.board[yCheck][xCheck].health = Math.ceil(enemyHP - totalAttack);
    }
  }
};

//! CURRENLY KILLS IF THERE IS 3 NOT 4.. SURROUNDING
const checkMiddleKill = (cy, cx, y, x, tempGameState) => {
  // Save check into variable,
  const yCheck = cy + y;
  const xCheck = cx + x;
  const yCheckTwo = cy - y;
  const xCheckTwo = cx - x;

  // See if varaible is less than 0 -- Out of bounds -- or empty..
  if (checkGreaterOrLessThan(tempGameState, yCheck, xCheck) === false) return;
  if (checkGreaterOrLessThan(tempGameState, yCheckTwo, xCheckTwo) === false) return;

  // Check if there are enemies on opposite sides to kill..
  if (
    tempGameState.board[yCheck][xCheck].player !== tempGameState.currentTurn &&
    tempGameState.board[yCheckTwo][xCheckTwo].player !== tempGameState.currentTurn
  ) {
    // Get Healths and damages
    const attacker = tempGameState.board[cy][cx].attack;
    const enemyOne = tempGameState.board[yCheckTwo][xCheckTwo].health;
    const enemyTwo = tempGameState.board[yCheck][xCheck].health;

    // Calculate damage
    tempGameState.board[yCheck][xCheck].health = Math.ceil(enemyTwo - attacker);
    tempGameState.board[yCheckTwo][xCheckTwo].health = Math.ceil(enemyOne - attacker);
  }
};

// Run all sandwich kill checks..
const checkAllSandwichKill = (cy, cx, gameState) => {
  // Up
  checkSandwichKill(cy, cx, -1, 0, gameState);
  // Down
  checkSandwichKill(cy, cx, 1, 0, gameState);
  // Left
  checkSandwichKill(cy, cx, 0, -1, gameState);
  // Right
  checkSandwichKill(cy, cx, 0, 1, gameState);
  // Top Left
  checkSandwichKill(cy, cx, -1, -1, gameState);
  //Top Right
  checkSandwichKill(cy, cx, -1, 1, gameState);
  //Bottom Left
  checkSandwichKill(cy, cx, 1, -1, gameState);
  // Bottom Right
  checkSandwichKill(cy, cx, 1, 1, gameState);
};

// Run all middle kill checks
const checkAllMiddleKill = (cy, cx, gameState) => {
  // Up and Down
  checkMiddleKill(cy, cx, 1, 0, gameState);

  // Left and Right
  checkMiddleKill(cy, cx, 0, 1, gameState);

  //Diagnal Left to Right
  checkMiddleKill(cy, cx, 1, 1, gameState);

  // Diagnal Righ to Left
  checkMiddleKill(cy, cx, 1, -1, gameState);
};
