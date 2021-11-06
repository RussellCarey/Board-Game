import { useEffect, useState } from "react";
import styled from "styled-components";

const Panel = styled.div`
  width: 100vw;
  height: 100px;

  position: fixed;
  bottom: 0;
  left: 0;

  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Button = styled.button`
  width: 200px;
  height: 60px;
  background-color: #7a7abf;
`;

const ButtonText = styled.p`
  color: black;
  font-size: 16px;
`;

export default function BottomPanel({ socketRef }) {
  const startOnClick = () => {
    socketRef.current.emit("createRoomRequest");
  };

  return (
    <Panel>
      <Button onClick={startOnClick}>
        <ButtonText>Start Game</ButtonText>
      </Button>
    </Panel>
  );
}
