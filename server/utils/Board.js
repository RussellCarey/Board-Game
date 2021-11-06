const TileClass = require("./Tile");

class Board {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.pieceCount = {
      0: (boardSize = 5 ? 8 : 12),
      1: (boardSize = 5 ? 8 : 12),
    };

    this.tiles = this.generateTiles(this.boardSize);
  }

  // Generate a blank board to work with..
  generateBlankBoard = (size) => {
    const board = [];
    for (let i = 0; i < size; i++) {
      board.push(Array.from(Array(size)));
    }
    return board;
  };

  // Generate each indivdual tile
  generateTiles = (size) => {
    const board = this.generateBlankBoard(this.boardSize);

    // Add the default options for each tile..
    board.forEach((row, indy) => {
      row.forEach((tile, indx) => {
        board[indy][indx] = new TileClass([indy, indx], 0, "test", null, null, "grey", "");
      });
    });

    this.addPlayers(board, size);

    return board;
  };

  // Add players starting position to the board.. //! Later this will need to be from their deck..
  addPlayers = (board, boardSize) => {
    // Get the amount of squares each team should creep up the sides..
    const playerOneLeft = Math.ceil(boardSize / 2);
    const playerOneRight = Math.floor(boardSize / 2);
    const playerTwoLeft = Math.floor(boardSize / 2);
    const playerTwoRight = Math.ceil(boardSize / 2);

    board.map((rows, indy) => {
      rows.map((tile, indx) => {
        // Check players TWOS left positioning
        if (indy < playerOneLeft && indx === 0) {
          tile.player = 1;
          tile.attack = Math.ceil(Math.random() * 10);
          tile.health = Math.ceil(Math.random() * 15);
        }

        // Check players ONES left positioning
        if (indy >= playerTwoLeft && indx === 0) {
          tile.player = 0;
          tile.attack = Math.ceil(Math.random() * 10);
          tile.health = Math.ceil(Math.random() * 15);
        }

        // Check player TWO right position,
        if (indy <= playerOneRight && indx === boardSize - 1) {
          tile.player = 1;
          tile.attack = Math.ceil(Math.random() * 10);
          tile.health = Math.ceil(Math.random() * 15);
        }

        // Check player ONE right position,
        if (indy >= playerTwoRight && indx === boardSize - 1) {
          tile.player = 0;
          tile.attack = Math.ceil(Math.random() * 10);
          tile.health = Math.ceil(Math.random() * 15);
        }

        // Populate player one at the top of the board
        if (indy === 0) {
          tile.player = 1;
          tile.attack = Math.ceil(Math.random() * 10);
          tile.health = Math.ceil(Math.random() * 15);
        }

        // Populate player two at the bottom of the board
        if (indy === boardSize - 1) {
          tile.player = 0;
          tile.attack = Math.ceil(Math.random() * 10);
          tile.health = Math.ceil(Math.random() * 15);
        }
      });
    });
  };

  //! Check if we can run the chosen move that the player has chosen ( THIS IS THE WHOLE MOVE LOGIC ) !important.
  canMakeSelectedMove = (socket, rooms, tileFrom, tileTo) => {
    // Get current room from users..
    let canMakeMove = false;

    if (this.tiles[tileTo[0]][tileTo[1]].player === null) {
      // Check if it is a valid move..
      const currenty = tileFrom[0];
      const currentx = tileFrom[1];

      // Check the tiles saved possible moves to see if that is one we can do..
      canMakeMove = this.tiles[currenty][currentx].possibleMoves.some(
        (pos) => pos[0] === tileTo[0] && pos[1] === tileTo[1]
      );
    }

    // If we can move, movee
    if (canMakeMove) {
      this.movePlayerToNewSquare(tileTo[0], tileTo[1], tileFrom[0], tileFrom[1], socket, rooms);
      this.checkKills(tileTo[0], tileTo[1], socket, rooms);
      this.checkBoardForDeaths(socket, rooms);
      this.checkWinningCondition(socket, rooms);

      // Change turn as we can make a move..
      rooms[socket.currentRoom].currentTurn == 0
        ? (rooms[socket.currentRoom].currentTurn = 1)
        : (rooms[socket.currentRoom].currentTurn = 0);

      // Keep track of the current turn number incase we implement character effects later..
      rooms[socket.currentRoom].turnNumber++;

      return true;
    }

    if (!canMakeMove) {
      return false;
    }
  };

  checkGreaterOrLessThan = (y, x) => {
    if (
      !(x >= 0) ||
      !(x <= this.boardSize - 1) ||
      !(y >= 0) ||
      !(y <= this.boardSize - 1) ||
      this.tiles[y][x].player === null
    ) {
      return false;
    }
  };

  // Move one player from one tile to another..
  movePlayerToNewSquare = (y, x, oldy, oldx) => {
    this.tiles[y][x].player = this.tiles[oldy][oldx].player;
    this.tiles[y][x].attack = this.tiles[oldy][oldx].attack;
    this.tiles[y][x].health = this.tiles[oldy][oldx].health;
    this.tiles[y][x].rarity = this.tiles[oldy][oldx].rarity;
    this.tiles[y][x].img = this.tiles[oldy][oldx].img;
    this.tiles[oldy][oldx].resetTile();
  };

  // Check sandwich kill.
  checkSandwichKill = (cy, cx, y, x, socket, rooms) => {
    // Save check into variable, see if varaible is less than 0 -- Out of bounds
    const yCheck = cy + y;
    const xCheck = cx + x;
    const currentTurn = rooms[socket.currentRoom].currentTurn;

    // If tile being checked is not posible, return..
    if (this.checkGreaterOrLessThan(yCheck, xCheck) === false) return;

    // Check if one tile over is not current player, or an empty tile == enemy tile.
    if (this.tiles[yCheck][xCheck].player !== null && this.tiles[yCheck][xCheck].player !== currentTurn) {
      // Save check into variable, see if varaible is less than 0 -- Out of bounds
      const yCheckTwo = cy + y + y;
      const xCheckTwo = cx + x + x;

      // If tile being checked is not posible, return..
      if (this.checkGreaterOrLessThan(yCheckTwo, xCheckTwo) === false) return;

      // There is an enemy here so check the other side for friendly..
      if (this.tiles[yCheckTwo][xCheckTwo].player === currentTurn) {
        // Calculate the attack damage of the 2 attackers, divided by 2.
        const attackerOne = this.tiles[yCheckTwo][xCheckTwo].attack;
        const attackerTwo = this.tiles[cy][cx].attack;
        const totalAttack = attackerOne + attackerTwo / 2;

        // Take away the attack from the enemy HP
        const enemyHP = this.tiles[yCheck][xCheck].health;
        this.tiles[yCheck][xCheck].health = Math.ceil(enemyHP - totalAttack);
      }
    }
  };

  // Check if a middle kill has happened..
  checkMiddleKill = (cy, cx, y, x, socket, rooms) => {
    // Save check into variable,
    const yCheck = cy + y;
    const xCheck = cx + x;
    const yCheckTwo = cy - y;
    const xCheckTwo = cx - x;
    const currentTurn = rooms[socket.currentRoom].currentTurn;

    // See if varaible is less than 0 -- Out of bounds -- or empty..
    if (this.checkGreaterOrLessThan(yCheck, xCheck) === false) return;
    if (this.checkGreaterOrLessThan(yCheckTwo, xCheckTwo) === false) return;

    // Check if there are enemies on opposite sides to kill..
    if (this.tiles[yCheck][xCheck].player !== currentTurn && this.tiles[yCheckTwo][xCheckTwo].player !== currentTurn) {
      // Get Healths and damages
      const attacker = this.tiles[cy][cx].attack;
      const enemyOne = this.tiles[yCheckTwo][xCheckTwo].health;
      const enemyTwo = this.tiles[yCheck][xCheck].health;

      // Calculate damage
      this.tiles[yCheck][xCheck].health = Math.ceil(enemyTwo - attacker);
      this.tiles[yCheckTwo][xCheckTwo].health = Math.ceil(enemyOne - attacker);
    }
  };

  // Run all sandwich kill checks..
  checkKills = (cy, cx, socket, rooms) => {
    const directionChecks = [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
      [-1, 0],
      [0, -1],
      [-1, -1],
      [-1, 1],
    ];

    // Check all directions..
    directionChecks.forEach((check) => {
      this.checkSandwichKill(cy, cx, check[0], check[1], socket, rooms);
    });

    // Only check the first 4 directions from the array and run check Middle kill
    directionChecks.forEach((check, ind) => {
      if (ind <= 3) this.checkMiddleKill(cy, cx, check[0], check[1], socket, rooms);
    });
  };

  // Check board for deaths after all calculations..
  checkBoardForDeaths = (socket, rooms) => {
    const currentTurn = rooms[socket.currentRoom].currentTurn;

    this.tiles.map((rows) => {
      rows.map((tiles) => {
        if (tiles.health <= 0 && tiles.player !== null) {
          const ypos = tiles.position[0];
          const xpos = tiles.position[1];

          //? Remove a peice from the peice count - for win conditions!
          const currentCount = this.pieceCount[`${currentTurn === 0 ? 1 : 0}`];
          this.pieceCount[`${currentTurn === 0 ? 1 : 0}`] = currentCount - 1;

          //! Here we need to check if the tile has an ability and activate it if it does..
          //   this.tiles[ypos][xpos].onDeathEffect(this.boardSize);

          // Delete the player from the board..
          this.tiles[ypos][xpos].resetTile();
        }
      });
    });
  };

  // Check if someone has won.
  checkWinningCondition = () => {
    if (this.pieceCount["0"] <= 1) console.log("Player 2 is the winner");
    if (this.pieceCount["1"] <= 1) console.log("Player 1 is the winner");
  };
}

module.exports = Board;
