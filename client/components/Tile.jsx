import { useEffect, useState } from "react";
import styled from "styled-components";

const TileContainer = styled.div`
  background-color: ${(props) =>
    props.player === 1 ? "blue" : props.player === 0 ? "red" : props.player === "void" ? "grey" : "grey"};

  width: calc(100vw * 0.045);
  height: calc(100vw * 0.045);
  border-radius: ${(props) => (props.player !== null ? "5%" : "5%")};

  display: flex;
  justify-content: space-around;
  align-items: end;

  z-index: 10;

  position: absolute;
  left: ${(props) => `${props.xpos}%`};
  top: ${(props) => `${props.ypos}%`};

  transform: ${(props) => (props.player !== null ? "scale(160%)" : "")};
`;

const Number = styled.p`
  color: white;
  font-size: 12px;
  pointer-events: none;
`;

export default function Tile({
  data,
  gameState,
  setGameState,
  selectedPlayer,
  setSelectedPlayer,
  playerNumber,
  socketRef,
}) {
  // Manage turns
  const onClickHandler = (e) => {
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
        const canMakeMove = gameState.game.board[currenty][currentx].possibleMoves.some(
          (pos) => pos[0] === data.position[0] && pos[1] === data.position[1]
        );

        document.querySelectorAll(".tile").forEach((card) => {
          card.classList.remove("playerSelected");
        });

        // If we cannot do this move, return..
        if (!canMakeMove) return;

        // If we can move, send the request to the server..
        socketRef.current.emit("attemptMove", {
          from: [selectedPlayer.position[0], selectedPlayer.position[1]],
          to: [data.position[0], data.position[1]],
        });
      }
    }
  };

  return (
    <TileContainer
      onClick={(e) => onClickHandler(e)}
      className="tile"
      player={data.player}
      ypos={data.position[0] * 25 - 3}
      xpos={data.position[1] * 25 - 3}
    >
      <Number>{data.attack}</Number>
      <Number>{data.health}</Number>
    </TileContainer>
  );
}
