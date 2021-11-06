export const checkMovement = (e, data, gameState, playerNumber, selectedPlayer, setSelectedPlayer) => {
  // If it is my turn..
  if (gameState.game.currentTurn === playerNumber) {
    // When we have no clicked on our player
    if (data.player !== playerNumber && selectedPlayer === null) return;

    if (data.player == playerNumber) {
      // Select current selected player as this space..
      setSelectedPlayer(data);

      // Get all currently active players and remove there select if they have..
      document.querySelectorAll(".tile").forEach((card) => {
        card.classList.remove("playerSelected");
      });

      // Add select to this one..
      e.target.classList.add("playerSelected");
    }

    // Try to move player that is selected..
    if (selectedPlayer !== null && data.player === null) {
      const currenty = selectedPlayer.position[0];
      const currentx = selectedPlayer.position[1];

      // Check if the move we made is allowed..
      const canMakeMove = gameState.game.board.tiles[currenty][currentx].possibleMoves.some(
        (pos) => pos[0] === data.position[0] && pos[1] === data.position[1]
      );

      document.querySelectorAll(".tile").forEach((card) => {
        card.classList.remove("playerSelected");
      });

      // If we cannot do this move, return..
      if (!canMakeMove) return false;
      if (canMakeMove) return true;
    }
  }
};
