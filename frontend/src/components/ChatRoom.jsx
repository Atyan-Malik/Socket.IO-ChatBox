import React, { useEffect, useRef } from "react";
import "../styles/ChatRoom.css";

const ChatWindow = ({ messages, username }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${
            msg.user === username ? "own-message" : "other-message"
          }`}
        >
          <span className="user">{msg.user}:</span>
          <span className="text">{msg.text}</span>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatWindow;
