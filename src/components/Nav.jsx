import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Badge,
  MenuItem,
  Menu,
  Stack,
  Button,
  IconButton,
  ListItemIcon,
} from "@mui/material";

import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { useNavigate } from "react-router-dom";
import AlertComponent from "./AlertComponent";
import useSocket from "../Hooks/useSocket";
import useGlobalState from "../Hooks/useGlobalState";
import useSendRequest from "../Hooks/useSendRequest";

export default function Nav({ setPage, navRef, setNavigationOpen }) {
  const userId = JSON.parse(localStorage.getItem("stucon"))?.user._id;

  const navigate = useNavigate();
  const socket = useSocket();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [globalState, setGlobalState] = useGlobalState();

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

  React.useEffect(() => {
    let id;
    if (globalState.isAlert) {
      id = setTimeout(() => {
        setGlobalState({ ...globalState, isAlert: false, alertMessage: "" });
      }, 3000);
    }

    return () => {
      clearTimeout(id);
    };
  }, [globalState.isAlert]);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const updateMessageBadge = (amount) => {
    // console.log(amount);
    setUserWithUnreadMessages(amount);
  };

  const updateNotificationBadge = (noti) => {
    setFriendRequest((prev) => prev + 1);
  };

  const reduceNotificationBadge = (noti) => {
    setFriendRequest((prev) => {
      if (prev > 0) return prev - 1;
      else return prev;
    });
  };

  React.useEffect(() => {
    if (socket.current?.id) {
      socket.current.on("update-message-notification", updateMessageBadge);
      socket.current.on("update-local-notification", reduceNotificationBadge);
      socket.current.on("connection-request", updateNotificationBadge);
    }
    return () => {
      if (socket.current?.id) {
        socket.current.off("update-message-notification", updateMessageBadge);
        socket.current.off(
          "update-local-notification",
          reduceNotificationBadge
        );
        socket.current.off("connection-request", updateNotificationBadge);
      }
    };
  }, [socket]);

  React.useEffect(() => {
    if (userId)
      fetchUserWithUnreadMessages({
        url: `${
          import.meta.env.VITE_SERVER_URL
        }/friends/get-user-with-unread-messages/${userId}`,
        method: "GET",
      });
  }, [userId]);

  React.useEffect(() => {
    if (userId)
      fetchFriendsReq({
        url: `${
          import.meta.env.VITE_SERVER_URL
        }/friends/get-friend-request/${userId}`,
        method: "GET",
      });
  }, [userId]);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = (option) => {
    setAnchorEl(null);
    if (option === "LogIn") {
      setPage("LogIn");
    } else if (option === "SignUp") {
      setPage("SignUp");
    } else if (option === "Profile") {
      const userId = JSON.parse(localStorage.getItem("stucon")).user._id;
      navigate(`/profile/${userId}`);
    }
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handelLogOutButton = (e) => {
    setAnchorEl(null);
    localStorage.clear();
    navigate("/");
    setGlobalState({ isLogedIn: false, isLoding: false, userName: "" });
  };

  const logOutNavButton = (
    <Stack spacing={1} direction="row">
      <Button
        onClick={() => setPage("LogIn")}
        sx={{ color: "white" }}
        startIcon={<LogoutIcon />}
      >
        LogIn
      </Button>
      <Button
        onClick={() => setPage("SignUp")}
        sx={{ color: "white" }}
        startIcon={<SubscriptionsIcon />}
      >
        SignUp
      </Button>
    </Stack>
  );

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {globalState.isLogedIn && (
        <MenuItem onClick={() => handleMenuClose("Profile")}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <p>Profile</p>
        </MenuItem>
      )}
      {globalState.isLogedIn && (
        <MenuItem onClick={handelLogOutButton}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <p>LogOut</p>
        </MenuItem>
      )}
      {!globalState.isLogedIn && (
        <MenuItem onClick={() => handleMenuClose("LogIn")}>
          <IconButton>
            <LoginIcon />
          </IconButton>
          <p>LogIn</p>
        </MenuItem>
      )}
      {!globalState.isLogedIn && (
        <MenuItem onClick={() => handleMenuClose("SignUp")}>
          <IconButton>
            <SubscriptionsIcon />
          </IconButton>
          <p>SignUp</p>
        </MenuItem>
      )}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {!globalState.isLogedIn && (
        <div>
          <MenuItem
            onClick={() => {
              handleMobileMenuClose();
              setPage("LogIn");
            }}
          >
            <ListItemIcon
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <LoginIcon />
            </ListItemIcon>
            <p>LogIn</p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMobileMenuClose();
              setPage("SignUp");
            }}
          >
            <ListItemIcon
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <SubscriptionsIcon />
            </ListItemIcon>
            <p>SignUp</p>
          </MenuItem>
        </div>
      )}

      {globalState.isLogedIn && (
        <div>
          <MenuItem
            onClick={() => {
              localStorage.clear();
              handleMobileMenuClose();
              navigate("/");
            }}
          >
            <ListItemIcon
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <LogoutIcon />
            </ListItemIcon>
            <p>LogOut</p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMobileMenuClose();
              navigate("/notifications");
            }}
          >
            <ListItemIcon
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={friendsReq.length} color="primary">
                <NotificationsIcon />
              </Badge>
            </ListItemIcon>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMobileMenuClose();
              navigate("/messenger");
            }}
          >
            <ListItemIcon
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={userWithUnreadMessages} color="primary">
                <MailIcon />
              </Badge>
            </ListItemIcon>
            <p>Messenger</p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMobileMenuClose();
              navigate("/searchpapers");
            }}
          >
            <ListItemIcon
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <UploadFileIcon />
            </ListItemIcon>
            <p>Search Paper</p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMobileMenuClose();
              navigate("/find-friends");
            }}
          >
            <ListItemIcon
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <PeopleAltIcon />
            </ListItemIcon>
            <p>Find Friends</p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMobileMenuClose();
              const userId = JSON.parse(localStorage.getItem("stucon")).user
                ._id;
              navigate(`/profile/${userId}`);
            }}
          >
            <ListItemIcon
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </ListItemIcon>
            <p>Profile</p>
          </MenuItem>
        </div>
      )}
    </Menu>
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "fixed",
        top: 0,
        zIndex: 100,
        minWidth: "100vw",
      }}
      ref={navRef}
    >
      {globalState.isAlert && (
        <AlertComponent message={globalState.alertMessage} />
      )}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            sx={{
              color: "white",
              marginRight: "1%",
              padding: "1%",
              display: { md: "block", sm: "none", xs: "none" },
            }}
            onClick={() => setNavigationOpen((prevstate) => !prevstate)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            StuCon
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {globalState.isLogedIn && (
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            )}
            {!globalState.isLogedIn && logOutNavButton}
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {globalState.isLogedIn && renderMenu}
    </Box>
  );
}
