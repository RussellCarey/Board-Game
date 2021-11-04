import { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function DeckBuilder() {
  useEffect(() => {}, []);

  return <Container></Container>;
}
