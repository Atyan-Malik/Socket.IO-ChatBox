import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import MessageInput from "./MessageInput";
import ChatRoom from "./ChatRoom";
import "../styles/Socketio.css";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(""); // confirmed name
  const [tempName, setTempName] = useState(""); // typing input name
  const socketRef = useRef();

useEffect(() => {
  socketRef.current = io("http://localhost:5000", {
    transports: ["websocket"], // ✅ ensures stable connection
  });

  socketRef.current.on("chatRoom", (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  return () => {
    socketRef.current.disconnect();
  };
}, []);

  const sendMessage = (text) => {
    if (text.trim()) {
      const msgData = { user: username || "Anonymous", text };
      socketRef.current.emit("chatRoom", msgData);
      // setMessages((prev) => [...prev, msgData]);
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUsername(tempName);
    }
  };

  return (
    <>
      <div className="chatbox">
        <div className="head">
          <h1>ChatBOX</h1>
          <p>connect with us Now!</p>
        </div>
        <div className="chat-container">
          {!username ? (
            <form className="username-box" onSubmit={handleJoin}>
              <h2>Enter your name</h2>
              <input
                type="text"
                placeholder="Your name..."
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
              />
              <button type="submit">Join Chat</button>
            </form>
          ) : (
            <>
              <ChatRoom messages={messages} username={username} />
              <MessageInput sendMessage={sendMessage} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatApp;
