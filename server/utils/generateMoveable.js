// This will produce - numbers but we have checks on the movement to not take those into account.
const createStartMovement = (board, y, x, boardSize) => {
  board[y][x].possibleMoves = [
    [y - 1, x - 1],
    [y - 1, x],
    [y - 1, x + 1],
    [y + 1, x + 1],
    [y + 1, x],
    [y + 1, x + 1],
    [y, x - 1],
    [y, x + 1],
  ];
};

const createCrossMovement = (board, y, x, boardSize) => {
  board[y][x].possibleMoves = [
    [y + 1, x],
    [y - 1, x],
    [y, x - 1],
    [y, x + 1],
  ];
};

// There is a pattern where using the x and y numbers, odd to odd and even to even, can move in a star pattern and odd even or even odd move in a cross pattern.
exports.generateMoveablePositions = (board, boardSize) => {
  board.map((row) => {
    row.map((tile) => {
      // Even is true and odd is false..
      const y = tile.position[0] % 2 === 0 ? true : false;
      const x = tile.position[1] % 2 === 0 ? true : false;

      // Base on true or false values populate the board..
      if ((y && x) || (!y && !x)) {
        console.log(`Creating star at ${tile.position[0]}, ${tile.position[1]}`);
        createStartMovement(board, tile.position[0], tile.position[1], boardSize);
      }

      if ((y && !x) || (!y && x)) {
        console.log(`Creating cross at ${tile.position[0]}, ${tile.position[1]}`);
        createCrossMovement(board, tile.position[0], tile.position[1], boardSize);
      }
    });
  });
};
