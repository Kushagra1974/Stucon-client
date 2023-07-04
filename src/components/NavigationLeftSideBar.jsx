import {
  MenuList,
  MenuItem,
  ListItemIcon,
  Typography,
  Stack,
  Badge,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useSendRequest from "../Hooks/useSendRequest";
import useSocket from "../Hooks/useSocket";

import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

function NavigationLeftSideBar({ navigationOpen }) {
  const userId = JSON.parse(localStorage.getItem("stucon"))?.user._id;
  const socket = useSocket();

  const navigate = useNavigate();
  const [friendsReq, , , fetchFriendsReq, setFriendRequest] = useSendRequest(
    []
  );

  const [
    userWithUnreadMessages,
    ,
    ,
    fetchUserWithUnreadMessages,
    setUserWithUnreadMessages,
  ] = useSendRequest(0);

  const reduceNotificationBadge = (noti) => {
    // console.log("reduce notification");
    setFriendRequest((prev) => {
      if (prev > 0) return prev - 1;
      else return prev;
    });
  };

  const updateNotificationBadge = (noti) => {
    setFriendRequest((prev) => {
      return prev + 1;
    });
  };

  const updateMessageBadgeNotInNav = (count) => {
    // console.log(count);
    setUserWithUnreadMessages(count);
  };

  useEffect(() => {
    if (socket.current?.id) {
      socket.current.on("update-local-notification", reduceNotificationBadge);
      socket.current.on(
        "update-message-notification",
        updateMessageBadgeNotInNav
      );
      socket.current.on("connection-request", updateNotificationBadge);
    }
    return () => {
      if (socket.current?.id) {
        socket.current.off(
          "update-local-notification",
          reduceNotificationBadge
        );
        socket.current.off(
          "update-message-notification",
          updateMessageBadgeNotInNav
        );
        socket.current.off("connection-request", updateNotificationBadge);
      }
    };
  }, [socket]);

  useEffect(() => {
    fetchUserWithUnreadMessages({
      url: `${
        import.meta.env.VITE_SERVER_URL
      }/friends/get-user-with-unread-messages/${userId}`,
      method: "GET",
    });
  }, []);

  useEffect(() => {
    if (userId)
      fetchFriendsReq({
        url: `${
          import.meta.env.VITE_SERVER_URL
        }/friends/get-friend-request/${userId}`,
        method: "GET",
      });
  }, [userId]);

  return (
    <Stack
      spacing={2}
      sx={{
        minHeight: "100vh",
        width: "20vw",
        position: "fixed",
        borderRight: 5,
        borderRightColor: "#1976d2",
        top: "9%",
        paddingTop: "1rem",
        display: {
          sm: "none",
          xs: "none",
          md: "block",
        },
        boxSizing: "border-box",
        transition: "transform 0.5s",
        transform: navigationOpen ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      <MenuList>
        <MenuItem onClick={() => navigate("/messenger")}>
          <ListItemIcon>
            <Badge badgeContent={userWithUnreadMessages} color="primary">
              <MailIcon />
            </Badge>
          </ListItemIcon>
          <Typography>Messenger</Typography>
        </MenuItem>
        <MenuItem onClick={() => navigate("/notifications")}>
          <ListItemIcon>
            <Badge badgeContent={friendsReq.length} color="primary">
              <NotificationsIcon />
            </Badge>
          </ListItemIcon>
          <Typography>Notifications</Typography>
        </MenuItem>
        <MenuItem onClick={() => navigate("/searchpapers")}>
          <ListItemIcon>
            <UploadFileIcon />
          </ListItemIcon>
          <Typography>Search Papers</Typography>
        </MenuItem>

        <MenuItem onClick={() => navigate("/find-friends")}>
          <ListItemIcon>
            <PeopleAltIcon />
          </ListItemIcon>
          <Typography>Search Friends</Typography>
        </MenuItem>
      </MenuList>
    </Stack>
  );
}

export default NavigationLeftSideBar;
