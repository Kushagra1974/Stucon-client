import useSocket from "../Hooks/useSocket";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSendRequestAndAuth from "../Hooks/useSendRequestAndAuth";
import { ListItem, ListItemText, Typography, Button } from "@mui/material";

function FindFriendItem({
  userName,
  educationInstitute,
  employer,
  _id,
  isFriend,
}) {
  const socket = useSocket();
  const navigate = useNavigate();
  const [
    connectionReq,
    connectionReqLoding,
    connectionReqError,
    sendConnectionReq,
  ] = useSendRequestAndAuth(null);
  const [isPending, setIsPending] = useState(false);

  const sendReq = (friendId) => {
    // const token = JSON.parse(localStorage.getItem("stucon")).token;
    const userId = JSON.parse(localStorage.getItem("stucon")).user._id;
    // sendConnectionReq({
    //   url: `${import.meta.env.VITE_SERVER_URL}/friends/send-connection-request`,
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ userId, friendId }),
    // });
    setIsPending(true);
    if (socket.current?.id)
      socket.current.emit("send-connection-request", { userId, friendId });
  };
  // console.log(connectionReq, connectionReqError, connectionReqLoding);

  const updateConnectionRequestStatus = ({ msg, friendId }) => {
    if (friendId === _id && msg === "request-pending") {
      setIsPending(true);
    }
  };

  useEffect(() => {
    if (socket.current?.id) {
      socket.current.on(
        "acknowlege-send-connection-request",
        updateConnectionRequestStatus
      );
    }
    return () => {
      if (socket.current?.id) {
        socket.current.off(
          "acknowlege-send-connection-request",
          updateConnectionRequestStatus
        );
      }
    };
  }, [socket]);

  return (
    <ListItem
      sx={{
        margin: "10px 0",
        border: 1,
        borderColor: "#1976d2",
        borderRadius: 1,
      }}
    >
      <ListItemText
        primary={userName}
        secondary={
          <>
            <Typography
              sx={{ display: "block" }}
              component="span"
              variant="body2"
            >
              Education Institute : {educationInstitute}
            </Typography>
            <Typography
              sx={{ display: "block" }}
              component="span"
              variant="body2"
            >
              Employer : {employer}
            </Typography>
            {isFriend ? (
              <Button
                variant="outlined"
                onClick={() => {
                  navigate(`/profile/${_id}`);
                }}
              >
                View Profile
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => {
                  //send friend request
                  sendReq(_id);
                }}
              >
                {isPending ? "Pending" : "Connect"}
              </Button>
            )}
          </>
        }
      ></ListItemText>
    </ListItem>
  );
}

export default FindFriendItem;
