import Tile from "./Tile";
import styled from "styled-components";

const BoardContainer = styled.div`
  position: relative;
  width: calc(100vw * 0.3);
  height: calc(100vw * 0.3);
  z-index: 1;
`;

export default function Board({ gameState, setGameState, selectedPlayer, setSelectedPlayer, playerNumber, socketRef }) {
  return (
    <BoardContainer className="board">
      {console.log(gameState)}
      {gameState
        ? gameState.game.board.map((row) => {
            return row.map((point) => {
              return (
                <Tile
                  key={`${point.position[0]}${point.position[1]}`}
                  data={point}
                  selectedPlayer={selectedPlayer}
                  setSelectedPlayer={setSelectedPlayer}
                  gameState={gameState}
                  setGameState={setGameState}
                  playerNumber={playerNumber}
                  socketRef={socketRef}
                />
              );
            });
          })
        : null}
    </BoardContainer>
  );
}
