const path = require("path");
const dotenv = require("dotenv");
const randomWords = require("random-words");
const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").Server(app);

const port = 3010;

const socketController = require("./controllers/socketController");

// App setup
dotenv.config();

const localArray = ["http://127.0.0.1:3005", "http://localhost:3005", "localhost:3005", "http://localhost:3005/"];

app.use(
  cors({
    credentials: true, // allow session cookie from browser to pass through
    origin: localArray,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

server.listen(port, () => console.log(`Server has loaded on ${port}`));

socketController.setupSocketCommands(server);
