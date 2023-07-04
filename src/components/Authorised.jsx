import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Box } from "@mui/material";

import NavigationLeftSideBar from "./NavigationLeftSideBar";
import Nav from "./Nav";
import RightSideBar from "./RightSideBar";

import useGlobalState from "../Hooks/useGlobalState";

function Authorized({ children }) {
  const [navigationOpen, setNavigationOpen] = useState(true);

  const [globalState, setGlobalState] = useGlobalState();

  const navigate = useNavigate();

  useEffect(() => {
    const stuconLocalStore = JSON.parse(localStorage.getItem("stucon"));
    if (stuconLocalStore && stuconLocalStore.token) {
      const userName = stuconLocalStore.user.userName;
      setGlobalState({
        ...globalState,
        userName,
        isLogedIn: true,
        isLoding: false,
      });
    } else {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Nav setNavigationOpen={setNavigationOpen} />
      <Box
        sx={{
          display: "flex",
        }}
      >
        <NavigationLeftSideBar navigationOpen={navigationOpen} />
        <RightSideBar navigationOpen={navigationOpen}>{children}</RightSideBar>
      </Box>
    </>
  );
}

export default Authorized;
