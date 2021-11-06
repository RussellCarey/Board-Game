"use strict";
const Game = require("../../utils/Game");

// Start a new game / room
exports.createNewRoom = (socket, rooms) => {
  // Generate new Game Object inside the rooms object..
  const newRoomID = socket.username;
  const newBoard = new Game(5);
  rooms[newRoomID] = newBoard;

  // Set the users current room name to X, and join the new room..
  socket.currentRoom = newRoomID;
  socket.playerNumber = 0;
  rooms[newRoomID].playerCount++;
  rooms[newRoomID].players[0] = socket.username;
  socket.join(newRoomID);

  // Emit back to the user tne board data to populate their board.

  socket.emit("roomData", {
    game: rooms[newRoomID],
    playerNumber: socket.playerNumber,
  });
};

// Add a new player to a room
exports.joinRoomById = (io, socket, rooms, roomname) => {
  // Check if the room exists in the object..
  const foundRoom = rooms[roomname] ? true : false;

  // If the room name / code is found..
  if (foundRoom) {
    // Set the users current room name to X, and join the new room..
    socket.currentRoom = roomname;
    socket.playerNumber = 1;
    rooms[roomname].playerCount++;
    rooms[roomname].players[1] = socket.username;
    socket.join(roomname);

    // Emit back to the user tne board data to populate their board.
    socket.emit("roomData", {
      game: rooms[roomname],
      playerNumber: socket.playerNumber,
    });
  }

  // If the room code is not found..
  if (!foundRoom) {
    socket.emit("cannotJoinRoom", { roomname: roomname });
  }
};

// Search for an empty and join the first one we find..
exports.searchForEmptyRoom = (io, socket, rooms) => {
  // Convert map into 2D list:
  const all = Array.from(io.sockets.adapter.rooms);

  // Filter rooms whose name exist in set:
  const filterRooms = all.filter((room) => !room[1].has(room[0]));
  const results = filterRooms.map((i) => i[0]);

  // Check these names against rooms in our object and send back the first one to join this name..
  const roomToJoin = results.map((rn) => {
    if (rooms[rn] && rooms[rn].playerCount === 1) {
      return rn;
    }
  });

  return roomToJoin;
};

// Get total room list, full or not full for admin.
exports.getTotalRoomList = (io, rooms) => {
  let waitingRooms = [];

  // Loop through rooms in the rooms object..
  for (const room in rooms) {
    waitingRooms.push({
      roomname: room,
      players: [rooms[room].players[0], rooms[room].players[1]],
      playerNo: rooms[room].playerCount,
      boardSize: rooms[room].boardSize,
      turnNumber: rooms[room].turnNumber,
    });
  }

  return waitingRooms;
};
