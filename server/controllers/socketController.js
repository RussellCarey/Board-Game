"use strict";
const RoomServices = require("../services/socket/roomServices");
const randomWords = require("random-words");

exports.setupSocketCommands = (server) => {
  // Objec to hold game rooms
  const rooms = {};

  // Setting up server..
  const io = require("socket.io")(server, {
    cors: {
      origin: server,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // When a user connects..
  io.on("connection", (socket) => {
    // On connecting to the client
    socket.username = randomWords();
    socket.emit("connected");

    // // On getting username / user data from the client
    // socket.on("userdata", (userdata) => {
    //   console.log("Recieved  username");
    //   //! Get user data (not sure what yet) and work with it!.. --- I guess I will need the userID etc to call DB functions on it..
    //   socket.username = userdata.username;
    // });

    // On request to start a new game room
    socket.on("createRoomRequest", () => {
      RoomServices.createNewRoom(socket, rooms);
    });

    // On Request to join a game / room
    socket.on("joinRoomById", (roomname) => {
      RoomServices.joinRoomById(io, socket, rooms, roomname);
    });

    // Search for a room who is waiting for a player...
    socket.on("searchForGame", (roomname) => {
      RoomServices.searchForEmptyRoom(io, socket, rooms, roomname);
    });

    // Search for a room who is waiting for a player...
    socket.on("getRoomList", () => {
      const roomList = RoomServices.getTotalRoomList(io, rooms);
      socket.emit("roomList", roomList);
    });

    // Recieve move that is desired and run logic, return new data if okay..
    socket.on("attemptMove", (data) => {
      // On reciving a move attempt, move peice and do checks, send back move data
      rooms[socket.currentRoom].board.canMakeSelectedMove(socket, rooms, data.from, data.to);

      // Send back game either way
      io.to(socket.currentRoom).emit("roomData", {
        game: rooms[socket.currentRoom],
      });
    });
  });
};
