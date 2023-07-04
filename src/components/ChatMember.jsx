import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MenuItem, Typography } from "@mui/material";
import useMessengerState from "../Hooks/useMessengerState";
import useSocket from "../Hooks/useSocket";

function ChatMember({ user }) {
  const socket = useSocket();
  const navigate = useNavigate();
  const [messengerState, setMessengerState] = useMessengerState();
  const [isTyping, setIsTyping] = useState(false);
  const [newMessageLength, setNewMessageLength] = useState(0);

  // console.log(isTyping);

  const userTyping = (frndId) => {
    if (frndId === user._id) setIsTyping(true);
  };
  const userStopTyping = (frndId) => {
    if (frndId === user._id) setIsTyping(false);
  };

  const recivedMessage = (msg) => {
    if (msg.type === "received" && user._id === msg.sender) {
      setNewMessageLength((prev) => prev + 1);
    }
  };

  const updateInitialUnreadMessages = ({
    unreadMessagesCount,
    userId,
    receivedMessages,
  }) => {
    if (userId === user._id) {
      setNewMessageLength(unreadMessagesCount);
      // console.log(receivedMessages, userId);
    }
  };

  const updateUnreadMessages = ({
    unreadMessagesCount,
    userId,
    receivedMessages,
  }) => {
    if (userId === user._id) {
      setNewMessageLength(unreadMessagesCount);
    }
  };

  useEffect(() => {
    const friendId = user._id;
    const userId = JSON.parse(localStorage.getItem("stucon")).user._id;
    if (socket.current?.id) {
      socket.current.emit("get-intial-unread-messages-count", {
        friendId,
        userId,
      });
      socket.current.on(
        "update-intial-unread-messages",
        updateInitialUnreadMessages
      );
      socket.current.on("recieve-message", recivedMessage);
      socket.current.on("user-typing", userTyping);
      socket.current.on("user-not-typing", userStopTyping);
      socket.current.on("update-unread-messages", updateUnreadMessages);
    }
    return () => {
      if (socket.current?.id) {
        socket.current.off(
          "update-intial-unread-messages",
          updateInitialUnreadMessages
        );
        socket.current.off("recieve-message", recivedMessage);
        socket.current.off("user-typing", userTyping);
        socket.current.off("user-not-typing", userStopTyping);
        socket.current.off("update-unread-messages", updateUnreadMessages);
      }
    };
  }, [socket.current?.id]);

  return (
    <MenuItem
      sx={{
        border: "1px solid #1976d2",
        margin: "2%",
        borderRadius: "3px",
        background: "#1976d2",
        color: "white",
        "&:hover": {
          color: "black",
        },
      }}
      onClick={() => {
        setMessengerState((prev) => {
          return { ...prev, isToggle: true };
        });
        navigate(`/messenger/${user._id}`);
      }}
    >
      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {newMessageLength > 0 && (
          <Typography
            sx={{
              fontSize: "10px",
              borderRadius: "50%",
            }}
            component="span"
            marginRight="10px"
          >
            {newMessageLength}
          </Typography>
        )}
        {user.userName}
        {isTyping && (
          <Typography component="span" variant="caption" marginLeft="10px">
            Typing ...
          </Typography>
        )}
      </Typography>
    </MenuItem>
  );
}

export default ChatMember;
