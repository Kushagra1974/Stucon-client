import useGlobalState from "../Hooks/useGlobalState";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Box, Typography, Stack, Divider, Chip, Button } from "@mui/material";

import useSocket from "../Hooks/useSocket";
import useSendRequest from "../Hooks/useSendRequest";
import useMessengerState from "../Hooks/useMessengerState";

import DoneSharpIcon from "@mui/icons-material/DoneSharp";
import FiberManualRecordSharpIcon from "@mui/icons-material/FiberManualRecordSharp";

function ChatMemberMsgs() {
  const userId = JSON.parse(localStorage.getItem("stucon")).user._id;
  const token = JSON.parse(localStorage.getItem("stucon")).token;

  let { friendId } = useParams();

  const friendRef = useRef(null);
  const socket = useSocket();
  const stackRef = useRef(null);
  const dividerRef = useRef(null);
  const newMessageSend = useRef(false);
  const unreadMessagePresentRef = useRef(false);

  const navigate = useNavigate();
  const setGlobalState = useGlobalState()[1];

  const [messengerState, setMessengerState] = useMessengerState();

  const [messageStack, setMessageStack] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [friendOnline, setFriendOnline] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(false);
  const [userName, lodingUserName, , fetchUserName] = useSendRequest({});

  function sleep(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  const readMsgIcon = (
    <DoneSharpIcon
      sx={{ color: "#1976d2", width: "14px", height: "14px" }}
    ></DoneSharpIcon>
  );

  const unreadMegIcon = (
    <DoneSharpIcon sx={{ width: "14px", height: "14px" }} />
  );

  const fetchMessages = async (friend) => {
    const url = `${
      import.meta.env.VITE_SERVER_URL
    }/message/get-all-message/${userId}/${friendId}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await fetch(url, { headers });
    // await sleep(500);
    const jsonData = await response.json();
    if (!response.ok) throw new Error(jsonData.errorMessage);
    return jsonData;
  };

  // useEffect(() => {
  //   let id;
  //   // console.log(unreadMessagePresentRef.current);
  //   if (newMessageSend.current || !unreadMessagePresentRef.current) {
  //     newMessageSend.current = false;
  //     // id = setTimeout(() => {
  //     stackRef.current.scrollTop =
  //       stackRef.current.scrollHeight - stackRef.current.clientHeight;
  //     // }, 0);
  //   } else if (unreadMessagePresentRef.current) {
  //     // console.log(1);
  //     if (dividerRef.current) dividerRef.current.focus();
  //   }

  // return () => {
  //   if (id) clearTimeout(id);
  // };
  // }, [
  //   stackRef.current,
  //   dividerRef.current,
  //   unreadMessagePresentRef.current,
  //   messages,
  //   newMessageSend,
  // ]);
  useEffect(() => {
    if (unreadMessagePresentRef.current) {
      if (dividerRef.current) dividerRef.current.focus();
    }
  }, [unreadMessagePresentRef]);

  useEffect(() => {
    let id = "";
    if (
      newMessageSend.current ||
      !unreadMessagePresentRef.current ||
      messageStack
    ) {
      newMessageSend.current = false;
      id = setTimeout(() => {
        stackRef.current.scrollTop =
          stackRef.current.scrollHeight - stackRef.current.clientHeight;
      }, 100);
    }
    return () => {
      if (id) clearTimeout(id);
    };
  }, [
    newMessageSend.current,
    unreadMessagePresentRef.current,
    messengerState,
    messages,
  ]);

  useEffect(() => {
    if (friendId) {
      setMessagesLoading(true);
      setGlobalState((prev) => {
        return { ...prev, isLoading: true };
      });
      setMessagesError(false);
      setMessages([]);
      fetchMessages(friendId)
        .then((data) => {
          setMessages(data);
          setMessagesLoading(false);
          setGlobalState((prev) => {
            return { ...prev, isLoading: false };
          });
        })
        .catch((error) => {
          // console.log(error);
          if (
            error.message === "TOKEN_EXPIRED" ||
            error.message === "SESSION_INVALID" ||
            error.message === "SERVER_ERROR" ||
            error.message === "INVALID_CREDENTIAL"
          ) {
            setGlobalState((prev) => {
              return {
                ...prev,
                isAlert: true,
                alertMessage: error.message,
                isLogedIn: false,
                isLoading: false,
              };
            });
            navigate("/");
            localStorage.removeItem("stucon");
          }
          setMessagesError(true);
          setMessagesLoading(false);
        });
    }
  }, [friendId]);

  useEffect(() => {
    friendRef.current = friendId;
    fetchUserName({
      url: `${import.meta.env.VITE_SERVER_URL}/user/get-user-name/${friendId}`,
      method: "GET",
    });
  }, [friendId]);

  const userTyping = (frndId) => {
    if (frndId === friendRef.current) setIsTyping(true);
  };
  const userStopTyping = (frndId) => {
    if (frndId === friendRef.current) setIsTyping(false);
  };

  const isFriendOnline = (frndId) => {
    if (frndId === friendRef.current) setFriendOnline(true);
  };

  const isFriendOffline = (frndId) => {
    if (frndId === friendRef.current) setFriendOnline(false);
  };

  useEffect(() => {
    if (socket.current?.id) {
      socket.current.emit("check-friend-online", friendId);
    }
    setFriendOnline(false);
  }, [friendId, socket.current?.id]);

  const recivedMessage = (msg) => {
    if (msg.type === "send") {
      setMessages((prev) => [...prev, msg]);
      newMessageSend.current = true;
    } else if (msg.type === "received" && friendRef.current === msg.sender) {
      setMessages((prev) => [...prev, msg]);
    }
  };

  //todo --------------------------------------------------make a ref array to point to every element of the stack .--------------------------------------------

  useEffect(() => {
    let unreadMessagesPresent = false;
    const newMessageStack = [];

    messages.forEach((msg) => {
      if (msg.type === "send") {
        newMessageStack.push(
          <Typography
            sx={{
              border: "1px solid #1976d2",
              width: "fit-content",
              padding: "1%",
              alignSelf: "right",
              borderRadius: "5px",
              margin: "1%",
              marginLeft: "auto",
              maxWidth: "45%",
              overflowWrap: "break-word",
            }}
            key={msg._id}
          >
            {msg.message}
            {msg.isRead && readMsgIcon} {!msg.isRead && unreadMegIcon}
          </Typography>
        );
      } else if (
        msg.type === "received" &&
        msg.isRead === false &&
        !unreadMessagesPresent
      ) {
        unreadMessagePresentRef.current = true;
        unreadMessagesPresent = true;

        newMessageStack.push(dividerElement);
        newMessageStack.push(
          <Typography
            sx={{
              border: "1px solid #1976d2",
              width: "fit-content",
              padding: "1%",
              alignSelf: "right",
              borderRadius: "5px",
              margin: "1%",
              maxWidth: "45%",
              overflowWrap: "break-word",
            }}
            key={msg._id}
            className={`track ${msg._id}`}
          >
            {msg.message}
          </Typography>
        );
      } else if (msg.type === "received" && msg.isRead === false) {
        newMessageStack.push(
          <Typography
            sx={{
              border: "1px solid #1976d2",
              width: "fit-content",
              padding: "1%",
              alignSelf: "right",
              borderRadius: "5px",
              margin: "1%",
              maxWidth: "45%",
              overflowWrap: "break-word",
            }}
            key={msg._id}
            className={`track ${msg._id}`}
          >
            {msg.message}
          </Typography>
        );
      } else if (msg.type === "received") {
        newMessageStack.push(
          <Typography
            sx={{
              border: "1px solid #1976d2",
              width: "fit-content",
              padding: "1%",
              alignSelf: "right",
              borderRadius: "5px",
              margin: "1%",
              maxWidth: "45%",
              overflowWrap: "break-word",
            }}
            key={msg._id}
          >
            {msg.message}
          </Typography>
        );
      }
    });
    setMessageStack(newMessageStack);
  }, [messages]);

  const dividerElement = (
    <Divider key={"111111"} ref={dividerRef}>
      <Chip label="Unread Messages" />
    </Divider>
  );

  useEffect(() => {
    // const setTimeOutIds = [];
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        const elementInViewPort = entry.target;
        if (entry.isIntersecting) {
          //! test -> how to extract the id from the element;
          const className = elementInViewPort.className.split(" ");
          const messageId = className[className.indexOf("track") + 1];
          elementInViewPort.classList.remove("track");
          // const id = setTimeout(() => {
          //! test -> make this message read -> make socket connection for this;

          if (socket.current?.id && messageId) {
            // console.log(userId, "read");
            // console.log(elementInViewPort);
            socket.current.emit("mark-message-read", {
              messageId,
              friendId: friendRef.current,
              userId,
            });
          }
          //! test -> update state so that the current ele become isRead = true;

          setMessages((prev) => {
            return prev.map((msg) => {
              if (msg._id === messageId) {
                return { ...msg, isRead: true };
              }
              return msg;
            });
          });

          // setMessengerState((prev) => {
          //   return {
          //     ...prev,
          //     markMessageRead: { messageId: messageId, userId: friendId },
          //   };
          // });
          // }, 2000);
          // setTimeOutIds.push(id);
        }
      });
    };

    const observerOptions = {
      root: stackRef.current.target,
      rootMargin: "0px",
      threshold: 1,
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    if (stackRef.current) {
      const elementArray = document.getElementsByClassName("track");
      Array.from(elementArray).forEach((element) => {
        observer.observe(element);
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [messages, messageStack]);

  const setMessageToRead = ({ messageId, friendId }) => {
    if (friendRef.current === friendId)
      setMessages((prev) => {
        return prev.map((msg) => {
          if (msg._id === messageId) return { ...msg, isRead: true };
          else return msg;
        });
      });
  };

  useEffect(() => {
    if (socket.current?.id) {
      socket.current.on("recieve-message", recivedMessage);
      socket.current.on("user-typing", userTyping);
      socket.current.on("user-not-typing", userStopTyping);
      socket.current.on("frnd-online", isFriendOnline);
      socket.current.on("frnd-offline", isFriendOffline);
      socket.current.on("set-message-read", setMessageToRead);
    }
    return () => {
      if (socket.current?.id) {
        socket.current.off("recieve-message", recivedMessage);
        socket.current.off("user-typing", userTyping);
        socket.current.off("user-not-typing", userStopTyping);
        socket.current.off("frnd-online", isFriendOnline);
        socket.current.off("frnd-offline", isFriendOffline);
        socket.current.off("set-message-read", setMessageToRead);
      }
    };
  }, [socket.current, socket.current?.id]);

  return (
    <Box boxSizing="border-box" height="100%">
      <Typography
        sx={{
          width: "auto",
          position: "sticky",
          zIndex: "100",
          top: "0",
          background: "#1976d2",
          margin: 0,
          padding: "10px",
          color: "white",
          display: "flex",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        {lodingUserName && (
          <Typography component="span">Loading ....</Typography>
        )}
        {friendOnline && (
          <FiberManualRecordSharpIcon
            sx={{ color: "white", marginRight: "10px", width: "18px" }}
          />
        )}

        {userName && (
          <Typography component="span">{userName?.userName}</Typography>
        )}
        {isTyping && (
          <Typography component="span" variant="caption" marginLeft="10px">
            Typing ...
          </Typography>
        )}

        <Button
          variant="outlined"
          sx={{
            color: "white",
            marginLeft: "auto",
            display: {
              xs: "block",
              sm: "none",
            },
            "&:hover": {
              color: "black",
            },
          }}
          onClick={() => {
            setMessengerState((prev) => {
              return { ...prev, isToggle: false };
            });
          }}
        >
          Back
        </Button>
      </Typography>

      <Stack
        height="89%"
        sx={{
          overflow: "hidden",
          overflowY: "scroll",
          scrollBehavior: "smooth",
        }}
        ref={stackRef}
      >
        {messagesLoading && <Typography>Loading ... </Typography>}
        {messageStack}
      </Stack>
    </Box>
  );
}

export default ChatMemberMsgs;
