import { useEffect, useState } from "react";

import {
  MenuItem,
  Stack,
  Typography,
  Link,
  Button,
  List,
  ListItemText,
  ListItem,
  Divider,
  Grid,
  Box,
} from "@mui/material";

import DateSetter from "./DateSetter";

import useSocket from "../Hooks/useSocket";

import ModalComponent from "./ModalComponent";

import useSendRequest from "../Hooks/useSendRequest";

import useSendRequestAndAuth from "../Hooks/useSendRequestAndAuth";

function NotificationsComponent() {
  const userId = JSON.parse(localStorage.getItem("stucon")).user._id;
  const token = JSON.parse(localStorage.getItem("stucon"))?.token;
  const socket = useSocket();

  const [friendsReq, , , fetchFriendsReq, setFriendRequest] = useSendRequest(
    []
  );
  const [localNotification, , , fetchLocalNotification, setLocalNotification] =
    useSendRequestAndAuth([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState({});

  const [globalNotification, , , fetchGlobalNotification] = useSendRequest([]);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("stucon"))?.user._id;
    if (socket.current?.id) {
      socket.current.emit("user-online", userId);
    }
  }, [socket.current?.id]);

  useEffect(() => {
    if (userId)
      fetchFriendsReq({
        url: `${
          import.meta.env.VITE_SERVER_URL
        }/friends/get-friend-request/${userId}`,
        method: "GET",
      });
  }, [userId]);

  useEffect(() => {
    let id = "";
    id = setInterval(() => {
      fetchGlobalNotification({
        url: `${
          import.meta.env.VITE_SERVER_URL
        }/notification/get-global-notification/`,
        method: "GET",
      });
    }, 100000);
    return () => {
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    fetchLocalNotification({
      url: `${
        import.meta.env.VITE_SERVER_URL
      }/notification/get-local-notification/${userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, []);

  useEffect(() => {
    fetchGlobalNotification({
      url: `${
        import.meta.env.VITE_SERVER_URL
      }/notification/get-global-notification/`,
      method: "GET",
    });
  }, []);

  const updateLocalNotification = (notification) => {
    console.log("accepted connection req", notification);
    setLocalNotification((prev) => [...prev, notification]);
  };

  const updateConnectionRequest = (data) => {
    // console.log(data);

    setFriendRequest((prev) => [...prev, data]);
  };

  // console.log(localNotification);

  useEffect(() => {
    if (socket.current?.id) {
      socket.current.on("update-local-notification", updateLocalNotification);
      // console.log(1);
      socket.current.on("connection-request", updateConnectionRequest);
    }
    return () => {
      if (socket.current?.id) {
        socket.current.off(
          "update-local-notification",
          updateLocalNotification
        );
        socket.current.off("connection-request", updateConnectionRequest);
      }
    };
  }, [socket.current?.id]);

  return (
    <Box
      sx={{
        border: "2px solid #1976d2",
        padding: "0px",
        margin: "10px",
        textAlign: "center",
        borderRadius: "4px",
      }}
    >
      <Typography
        sx={{
          marginTop: 0,
          background: "#1976d2",
          color: "white",
          width: "100%",
          padding: 0,
        }}
        variant="h4"
      >
        Notifications
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {friendsReq.length > 0 && (
          <Grid item xs={12} sm={12} md={6}>
            <Box
              sx={{
                border: "2px solid #1976d2",
                padding: "0px",
                margin: "10px",
                textAlign: "center",
                borderRadius: "4px",
              }}
            >
              <Stack alignItems="center">
                <Typography
                  sx={{
                    marginTop: 0,
                    background: "#1976d2",
                    color: "white",
                    width: "100%",
                    padding: 0,
                  }}
                  variant="h6"
                  textAlign="center"
                >
                  Connection Requests
                </Typography>
                <ModalComponent
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                >
                  <Stack>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary={`Name : ${selectedReq.userName}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={`Education : ${selectedReq.educationInstitute}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={`Employer : ${selectedReq.employer}`}
                        />
                      </ListItem>
                    </List>
                    <Button
                      variant="contained"
                      sx={{ width: "fit-content", alignSelf: "center" }}
                      onClick={() => {
                        socket.current.emit("accept-connection-request", {
                          userId,
                          friendId: selectedReq._id,
                        });
                        setOpenModal(false);
                        setFriendRequest((prev) =>
                          prev.filter((user) => user._id !== selectedReq._id)
                        );
                      }}
                    >
                      Accept
                    </Button>
                  </Stack>
                </ModalComponent>
                {friendsReq?.map((user) => (
                  <MenuItem
                    onClick={() => {
                      setSelectedReq(user);
                      setOpenModal(true);
                    }}
                    key={user._id}
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Typography>
                      <Link component="button" sx={{ marginRight: "3%" }}>
                        {user.userName}
                      </Link>
                      wants to connect
                    </Typography>
                  </MenuItem>
                ))}
              </Stack>
            </Box>
          </Grid>
        )}

        {localNotification.length > 0 && (
          <Grid item xs={12} sm={12} md={6}>
            <Box
              sx={{
                border: "2px solid #1976d2",
                padding: "0px",
                margin: "10px",
                textAlign: "center",
                borderRadius: "4px",
              }}
            >
              <Stack alignItems="center">
                <Typography
                  sx={{
                    marginTop: 0,
                    background: "#1976d2",
                    color: "white",
                    width: "100%",
                    padding: 0,
                  }}
                  variant="h6"
                  textAlign="center"
                >
                  Local Notification
                </Typography>
                <Divider sx={{ width: "100%" }} />
                {localNotification.length > 0 && (
                  <List>
                    {localNotification.map(
                      ({ _id, type, friend, createdAt }) => {
                        if (type === "CONNECTION_REQUEST_ACCEPTED")
                          return (
                            <ListItem key={_id}>
                              <ListItemText
                                primary={
                                  <Typography>{`${friend.userName} has accepted connection request`}</Typography>
                                }
                                secondary={
                                  <span
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      component="span"
                                    >
                                      {friend.email}
                                    </Typography>
                                    |
                                    <DateSetter
                                      variant="inline"
                                      date={createdAt}
                                      text="Date"
                                      component="span"
                                    />
                                  </span>
                                }
                              />
                            </ListItem>
                          );
                        else if (type === "CONNECTED") {
                          return (
                            <ListItem key={_id}>
                              <ListItemText
                                primary={
                                  <Typography>{`${friend.userName} is connected`}</Typography>
                                }
                                secondary={
                                  <span
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      component="span"
                                    >
                                      {friend.email}
                                    </Typography>
                                    |
                                    <DateSetter
                                      variant="inline"
                                      text="Date"
                                      date={createdAt}
                                      component="span"
                                    />
                                  </span>
                                }
                              ></ListItemText>
                            </ListItem>
                          );
                        }
                      }
                    )}
                  </List>
                )}
              </Stack>
            </Box>
          </Grid>
        )}

        {globalNotification.length > 0 && (
          <Grid item xs={12} sm={12} md={6}>
            <Box
              sx={{
                border: "2px solid #1976d2",
                padding: "0px",
                margin: "10px",
                textAlign: "center",
                borderRadius: "4px",
              }}
            >
              <Stack alignItems="center">
                <Typography
                  sx={{
                    marginTop: 0,
                    background: "#1976d2",
                    color: "white",
                    width: "100%",
                    padding: 0,
                  }}
                  variant="h6"
                  textAlign="center"
                >
                  Global Notification
                </Typography>
                <Divider sx={{ width: "100%" }} />
                {globalNotification.length > 0 && (
                  <List>
                    {globalNotification.map(({ _id, user, createdAt }) => {
                      if (userId !== user._id) {
                        return (
                          <ListItem key={_id}>
                            <ListItemText
                              primary={
                                <Typography>
                                  {`${user.userName[0].toUpperCase()}${user.userName.slice(
                                    1,
                                    user.length
                                  )} uploaded file`}
                                </Typography>
                              }
                              secondary={
                                <>
                                  <Typography display="block" variant="caption">
                                    {user.email}
                                  </Typography>
                                  <DateSetter
                                    date={createdAt}
                                    text="Uploaded On"
                                  />
                                </>
                              }
                            />
                          </ListItem>
                        );
                      } else {
                        return (
                          <ListItem key={_id}>
                            <ListItemText
                              primary={
                                <Typography>You uploaded file</Typography>
                              }
                              secondary={<DateSetter date={createdAt} />}
                            />
                          </ListItem>
                        );
                      }
                    })}
                  </List>
                )}
              </Stack>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default NotificationsComponent;
