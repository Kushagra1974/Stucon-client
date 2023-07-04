import SearchIcon from "@mui/icons-material/Search";

import {
  Stack,
  FormControl,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  IconButton,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  MenuList,
  MenuItem,
  Container,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import useSocket from "../Hooks/useSocket";

import useSendRequest from "../Hooks/useSendRequest";
import ModalComponent from "./ModalComponent";
import FindFriendItem from "./FindFriendItem";

export default function SearchFriends() {
  const iconRef = useRef(null);
  const socket = useSocket();

  const [findFriend, setFindFriend] = useState("");
  const [getUserFriends, , , fetchUserFriend] = useSendRequest([]);
  const [users, , , fetchUser, setUsers] = useSendRequest([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFrnd, setSelectedFrnd] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("stucon")).user._id;
    fetchUserFriend({
      url: `${
        import.meta.env.VITE_SERVER_URL
      }/friends/get-my-friends/${userId}`,
      method: "GET",
    });
  }, []);

  // console.log(users);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("stucon"))?.user._id;
    if (socket.current?.id) {
      socket.current.emit("user-online", userId);
    }
  }, [socket.current?.id]);

  return (
    <Container>
      <Stack>
        <FormControl variant="outlined" sx={{ marginTop: "30px" }}>
          <InputLabel htmlFor="outlined-adornment-password">
            Find Friends
          </InputLabel>
          <OutlinedInput
            id="findfriends"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  ref={iconRef}
                  onClick={() => {
                    const userId = JSON.parse(localStorage.getItem("stucon"))
                      .user._id;
                    if (findFriend) {
                      fetchUser({
                        url: `${
                          import.meta.env.VITE_SERVER_URL
                        }/friends/find-friends/${findFriend}/${userId}`,
                        method: "GET",
                      });
                    }
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
            label="Find Friends"
            value={findFriend}
            onChange={(e) => {
              setFindFriend(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // console.log("yes");
                iconRef.current.click();
              }
            }}
          />
        </FormControl>
        <List>
          {users.map((user, i) => {
            return (
              <FindFriendItem
                key={i}
                userName={user.userName}
                employer={user.employer}
                educationInstitute={user.educationInstitute}
                _id={user._id}
                isFriend={user.isFriend}
              />
            );
          })}
        </List>
        <Button
          variant="outlined"
          sx={{ width: "fit-content", alignSelf: "center" }}
          onClick={() => {
            setUsers([]);
          }}
        >
          Clear Response
        </Button>
        <Divider sx={{ margin: "3% 0" }}></Divider>
      </Stack>
      <Stack alignItems="center">
        <Typography variant="h5">Friends</Typography>
        <ModalComponent openModal={openModal} setOpenModal={setOpenModal}>
          <List>
            <ListItem>
              <ListItemText primary={`Name : ${selectedFrnd.userName}`} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Education : ${selectedFrnd.educationInstitute}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Employer : ${selectedFrnd.employer}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Email : ${selectedFrnd.email}`} />
            </ListItem>
            <Button
              variant="contained"
              onClick={() => {
                navigate(`/profile/${selectedFrnd._id}`);
              }}
            >
              View Profile
            </Button>
          </List>
        </ModalComponent>
        <MenuList sx={{ width: "100%" }}>
          {getUserFriends.map(({ friend }) => (
            <MenuItem
              sx={{
                border: "1px solid #1976d2",
                margin: "10px 0",
                borderRadius: "3px",
                color: "white",
                background: "#1976d2",
                "&:hover": {
                  background: "white",
                  color: "black",
                },
              }}
              onClick={() => {
                setSelectedFrnd(friend);
                setOpenModal(true);
              }}
              key={friend._id}
            >
              {friend.userName}
            </MenuItem>
          ))}
        </MenuList>
      </Stack>
    </Container>
  );
}
