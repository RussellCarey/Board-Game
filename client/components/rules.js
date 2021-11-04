export function clickNewPlayer(data, selectedPlayer, setSelectedPlayer, e) {
  if (data.type !== "empty" && selectedPlayer === null) {
    e.target.classList.add("playerSelected");
    setSelectedPlayer([data.position[0], data.position[1], data.type]);
  }
}

export function checkMoveToEmptySpot(selectedPlayer, gameState, data) {
  if (data.type === "empty" && selectedPlayer !== null) {
    // Check if it is a valid move..
    const currenty = selectedPlayer[0];
    const currentx = selectedPlayer[1];
    const canMakeMove = gameState.board[currenty][currentx].possibleMoves.some(
      (pos) => pos[0] === data.position[0] && pos[1] === data.position[1]
    );

    console.log("Can move here");
    return canMakeMove;
  } else {
    console.log("Invalid move location");
  }
}

export function makeAMove(data, gameState, selectedPlayer, setGameState, setSelectedPlayer) {
  const state = { ...gameState };
  const y = data.position[0];
  const x = data.position[1];
  state.board[y][x].type = selectedPlayer[2];

  const oldy = selectedPlayer[0];
  const oldx = selectedPlayer[1];
  state.board[oldy][oldx].type = "empty";

  setGameState(state);
  setSelectedPlayer(null);
}

export function cantMakeMove(setSelectedPlayer) {
  setSelectedPlayer(null);
}
