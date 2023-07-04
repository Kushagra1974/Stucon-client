import { Box, MenuList, Typography } from "@mui/material";
import { Outlet, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";

import useSocket from "../Hooks/useSocket";
import TextFeildBottom from "./TextFeildBottom";
import ChatMember from "./ChatMember";
import useSendRequest from "../Hooks/useSendRequest";
import useMessengerState from "../Hooks/useMessengerState";

function ChatComponents() {
  let { friendId } = useParams();
  const friendRef = useRef(null);
  const [friends, lodingFriendsList, , fetchFriends, setFriends] =
    useSendRequest([]);
  const socket = useSocket();

  const [messengerState, setMessengerState] = useMessengerState();

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("stucon"))?.user._id;
    if (socket.current?.id) {
      socket.current.emit("user-online", userId);
    }
  }, [socket.current?.id]);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("stucon")).user._id;
    fetchFriends({
      url: `${
        import.meta.env.VITE_SERVER_URL
      }/friends/get-my-friends/${userId}`,
      method: "GET",
    });
  }, []);

  useEffect(() => {
    friendRef.current = friendId;
  }, [friendId]);

  const isTyping = (status) => {
    const userId = JSON.parse(localStorage.getItem("stucon")).user._id;
    if (status) {
      if (socket.current)
        socket.current.emit("istyping", {
          userId,
          friendId: friendRef.current,
        });
    } else {
      if (socket.current)
        socket.current.emit("nottyping", {
          userId,
          friendId: friendRef.current,
        });
    }
  };

  const getMessage = (msg) => {
    const userId = JSON.parse(localStorage.getItem("stucon")).user._id;
    if (msg.length !== 0 && friendRef.current && socket.current?.id) {
      socket.current.emit("send-message", {
        sender: userId,
        receiver: friendRef.current,
        message: msg,
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "10px",
        height: "88vh",
        margin: "10px",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <Box
        zIndex="0"
        border="2px solid #1976d2"
        borderRadius="3px"
        sx={{
          overflow: "hidden",
          overflowY: "scroll",
          display: {
            ...(messengerState.isToggle && { xs: "none" }),
            ...(!messengerState.isToggle && { xs: "block" }),
            sm: "block",
          },
          width: {
            sm: "30%",
            xs: "100%",
          },
        }}
        height="89%"
      >
        {lodingFriendsList && <Typography>loding ...</Typography>}
        <MenuList>
          {friends &&
            friends.length > 0 &&
            friends.map(({ friend, isonline }) => (
              <ChatMember user={friend} key={friend._id} />
            ))}
        </MenuList>
      </Box>
      <Box
        height="89%"
        border="2px solid #1976d2"
        borderRadius="3px"
        sx={{
          display: {
            ...(!messengerState.isToggle && { xs: "none" }),
            ...(messengerState.isToggle && { xs: "block" }),
            sm: "block",
          },
          width: {
            sm: "70%",
            xs: "100%",
          },
        }}
      >
        <Outlet />
      </Box>
      <TextFeildBottom getMessage={getMessage} isTyping={isTyping} />
    </Box>
  );
}

export default ChatComponents;
