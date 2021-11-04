// tile.player = 1;
// tile.attack = Math.ceil(Math.random() * 10);
// tile.health = Math.ceil(Math.random() * 15);

exports.addPlayers = (board, boardSize) => {
  // Get the amount of squares each team should creep up the sides..
  const playerOneLeft = Math.ceil(boardSize / 2);
  const playerOneRight = Math.floor(boardSize / 2);
  const playerTwoLeft = Math.floor(boardSize / 2);
  const playerTwoRight = Math.ceil(boardSize / 2);

  // Funcs
  populateTopAndBottomRow(board, boardSize);
  populateSides(board, boardSize, playerOneLeft, playerOneRight, playerTwoLeft, playerTwoRight);
};

// Populate the top and bottom row with a team..
const populateTopAndBottomRow = (board, boardSize) => {
  board.map((rows, indy) => {
    rows.map((tile, indx) => {
      if (indy === 0) {
        tile.player = 1;
        tile.attack = Math.ceil(Math.random() * 10);
        tile.health = Math.ceil(Math.random() * 15);
      }

      if (indy === boardSize - 1) {
        tile.player = 0;
        tile.attack = Math.ceil(Math.random() * 10);
        tile.health = Math.ceil(Math.random() * 15);
      }
    });
  });
};

// Populate up the sides with the corect time and the correct levels
const populateSides = (board, boardSize, playerOneLeft, playerTwoLeft, playerTwoRight) => {
  board.map((rows, indy) => {
    rows.map((tile, indx) => {
      // Check players TWOS left positioning
      if (indy < playerOneLeft && indx === 0) {
        tile.player = 1;
        tile.attack = Math.ceil(Math.random() * 10);
        tile.health = Math.ceil(Math.random() * 15);
      }

      // Check players ONES left positioning
      if (indy >= playerOneLeft && indx === 0) {
        tile.player = 0;
        tile.attack = Math.ceil(Math.random() * 10);
        tile.health = Math.ceil(Math.random() * 15);
      }

      // Check player TWO right position,
      if (indy < playerTwoLeft && indx === boardSize - 1) {
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
    });
  });
};
