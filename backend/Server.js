import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Allow frontend origin
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your Vite frontend
    methods: ["GET", "POST"],
  },
});

// store chat messages in memory (optional)
let messages = [];

io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  // send existing chat history to new user
  socket.emit("chatRoom", {
    user: "System",
    text: "Welcome to the chat 💬",
  });

  // when message received from client
  socket.on("chatRoom", (msgData) => {
    console.log("📩 Message received:", msgData);
    messages.push(msgData);

    // broadcast message to ALL users (including sender)
    io.emit("chatRoom", msgData);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
