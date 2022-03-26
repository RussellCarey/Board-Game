import Tile from "./Tile";
import styled from "styled-components";

const BoardContainer = styled.div`
  position: relative;
  width: calc(100vw * 0.4);
  height: calc(100vw * 0.4);
  z-index: 1;
`;

export default function Board({ gameState, setGameState, selectedPlayer, setSelectedPlayer, playerNumber, socketRef }) {
  return (
    <BoardContainer className="board">
      {gameState
        ? gameState.game.board.tiles.map((row) => {
            return row.map((tile) => {
              return (
                <Tile
                  key={`${tile.position[0]}${tile.position[1]}`}
                  data={tile}
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
