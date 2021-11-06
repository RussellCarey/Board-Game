import { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import Board from "../components/Board";
import BottomPanel from "../components/BottomPanel";

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;

  padding-top: 100px;
  padding-left: 100px;

  display: flex;
`;

const RoomListContainer = styled.div`
  width: 200px;
  height: 100vh;
  background-color: palegoldenrod;

  z-index: 1000;

  position: fixed;
  right: 0;
  top: 0;
`;

const RoomButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: gainsboro;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.p`
  z-index: 1000000;
  color: black;
  font-size: 40px;

  position: absolute;
  top: 0;
  right: 400px;
`;

export default function Home() {
  const socketRef = useRef();
  const [playerNumber, setPlayerNumber] = useState(100);
  const [selectedPlayer, setSelectedPlayer] = useState([]);
  const [gameState, setGameState] = useState(null);
  const [roomList, setRoomList] = useState([]);

  // Get room name from the datatype if the button and join room..
  const joinRoomFromList = (e) => {
    const roomName = e.target.getAttribute("datatype");
    console.log(roomName);
    socketRef.current.emit("joinRoomById", roomName);
  };

  useEffect(() => {
    socketRef.current = io("http://127.0.0.1:3010");

    // On connection to server
    socketRef.current.on("connected", () => {
      console.log("Connected");
      socketRef.current.emit("getRoomList");
    });

    // On joining a game / getting data
    socketRef.current.on("roomData", (data) => {
      console.log("Recieved new board data from the server");
      console.log(data);
      setGameState(data);
      if (data.playerNumber === 1 || data.playerNumber === 0) setPlayerNumber(data.playerNumber);
    });

    // On joining a game / getting data
    socketRef.current.on("roomList", (data) => {
      setRoomList(data);
    });
  }, []);

  return (
    <GameContainer>
      <Text>{gameState ? gameState.game.currentTurn : null}</Text>
      <RoomListContainer>
        {roomList.length > 0
          ? roomList.map((room) => {
              return (
                <RoomButton
                  datatype={room.roomname}
                  key={room.roomname}
                  onClick={(e) => {
                    joinRoomFromList(e);
                  }}
                >
                  {`${room.roomname}'s room.`} .. {`${room.playerNo}/2 players.`}
                </RoomButton>
              );
            })
          : null}
      </RoomListContainer>

      <BottomPanel socketRef={socketRef} />
      <Board
        gameState={gameState}
        setGameState={setGameState}
        selectedPlayer={selectedPlayer}
        setSelectedPlayer={setSelectedPlayer}
        playerNumber={playerNumber}
        socketRef={socketRef}
      />
    </GameContainer>
  );
}
