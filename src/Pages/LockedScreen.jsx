import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Container } from "@mui/material";

import Login from "../components/Login";
import SignUp from "../components/SignUp";
import Nav from "../components/Nav";

import useGlobalState from "../Hooks/useGlobalState";

const LockedScreen = () => {
  const [globalState, setGlobalState] = useGlobalState();
  const navigate = useNavigate();
  useEffect(() => {
    const stuconLocalStore = JSON.parse(localStorage.getItem("stucon"));
    if (stuconLocalStore?.token.length > 0) {
      const userName = stuconLocalStore.user.userName;
      setGlobalState({
        ...globalState,
        userName,
        isLogedIn: true,
        isLoding: false,
      });
      navigate("/home");
    } else {
      setGlobalState({ ...globalState, isLogedIn: false, userName: "" });
    }
  }, []);

  const [page, setPage] = useState("SignUp");

  return (
    <>
      <Nav setPage={setPage} />
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        {page === "SignUp" && <SignUp setPage={setPage} />}
        {page === "LogIn" && <Login setPage={setPage} />}
      </Container>
    </>
  );
};

export default LockedScreen;
