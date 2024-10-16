const path = require("path");
const https = require("https");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require("./utils/users");

const app = express();
const server = https.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Chat Bot";

// socket.emit is used to send a message from the server to a specific client identified by the socket.
// io.to(room).emit is used to send a message to all clients in a specific room.
// socket.broadcast.emit is used to send a message to all connected clients except the one that triggered the event.

// Run when client connects
io.on("connection", (socket) => {

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to Chat!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  // socket.on("chatMessage", (msg) => {
  //   const user = getCurrentUser(socket.id);
  //   io.to(user.room).emit("message", formatMessage(user.username, msg));
  // });

  socket.on("chatMessage", ({username, room, msg}) => {
    //const user = getCurrentUser(socket.id);
    io.to(room).emit("message", formatMessage(username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {

    const user = userLeave(socket.id);

    if (user) {
      socket.broadcast.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      socket.broadcast.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
