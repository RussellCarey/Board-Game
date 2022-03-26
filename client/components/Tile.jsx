import { useEffect, useState } from "react";
import { checkMovement } from "../utils/moveHandler";
import styled from "styled-components";

const TileContainer = styled.div`
  background-color: ${(props) =>
    props.player === 1 ? "blue" : props.player === 0 ? "red" : props.player === "void" ? "grey" : "grey"};

  width: calc(100vw * 0.05);
  height: calc(100vw * 0.05);
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
    const canMove = checkMovement(e, data, gameState, playerNumber, selectedPlayer, setSelectedPlayer);
    if (!canMove) return;

    console.log(selectedPlayer.position);
    console.log(data.position);

    // If we can move, send the request to the server..
    socketRef.current.emit("attemptMove", {
      from: [selectedPlayer.position[0], selectedPlayer.position[1]],
      to: [data.position[0], data.position[1]],
    });
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
