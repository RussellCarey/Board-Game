exports.generateBoard = (size) => {
  const board = [];

  // Create base board to iterate over and add tile parameters.
  for (let i = 0; i < size; i++) {
    board.push(Array.from(Array(size)));
  }

  return addPositionToTiles(board, size);
};

const addPositionToTiles = (board, size) => {
  const newBoard = [...board];

  // Add the default options for each tile..
  newBoard.forEach((row, indy) => {
    row.forEach((tile, indx) => {
      newBoard[indy][indx] = {
        position: [indy, indx],
        player: null,
        attack: null,
        health: null,
        rarity: "",
        img: "",
        possibleMoves: [],
      };
    });
  });

  return newBoard;
};
