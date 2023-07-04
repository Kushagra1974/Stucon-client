import { useNavigate } from "react-router-dom";

import { TextField, Stack, Button, Typography } from "@mui/material";

import useInput from "../Hooks/useInput";

import useGlobalState from "../Hooks/useGlobalState";

function SignUp({ setPage }) {
  const nameInput = useInput("");
  const emailInput = useInput("");
  const educationInstituteInput = useInput("");
  const employerInput = useInput("");
  const passwordInput = useInput("");
  const confPasswordInput = useInput("");

  const [globalState, setGlobalState] = useGlobalState();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      nameInput.value &&
      emailInput.value &&
      educationInstituteInput.value &&
      employerInput.value &&
      passwordInput.value &&
      confPasswordInput.value
    ) {
      if (passwordInput.value === confPasswordInput.value) {
        setGlobalState({ ...globalState, isLoding: true });
        try {
          const response = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/auth/signup`,
            {
              method: "POST",
              body: JSON.stringify({
                userName: nameInput.value,
                email: emailInput.value,
                educationInstitute: educationInstituteInput.value,
                employer: employerInput.value,
                password: passwordInput.value,
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            }
          );
          const data = await response.json();
          const { token, user } = data;
          if (response.status === 200 || response.status === 201) {
            setGlobalState({
              ...globalState,
              isLoding: false,
              isLogedIn: true,
              userName: user.userName,
            });
            localStorage.setItem("stucon", JSON.stringify({ token, user }));
            navigate("/home");
          } else {
            setGlobalState({
              isLoding: false,
              isLogedIn: false,
              userName: "",
              isAlert: true,
              alertMessage: "Email Already Exist In DataBase",
            });
          }
        } catch (err) {
          setGlobalState({
            isLoding: false,
            isLogedIn: false,
            userName: "",
            isAlert: true,
            alertMessage: "Service Unavailable",
          });
        }
      } else
        setGlobalState({
          ...globalState,
          isAlert: true,
          alertMessage: "Password and ConformPassword must be same",
        });
    } else {
      setGlobalState({
        ...globalState,
        isAlert: true,
        alertMessage: "All feild are required",
      });
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <Stack
        spacing={2}
        sx={{
          border: 2,
          borderColor: "#1976d2",
          padding: 5,
          paddingTop: 3,
          borderRadius: 5,
          marginTop: 7,
        }}
      >
        <Typography
          variant="body1"
          sx={{ color: "#1976d2", textAlign: "center" }}
        >
          SignUp
        </Typography>
        <TextField
          id="name"
          label="Name"
          variant="outlined"
          autoComplete="off"
          {...nameInput}
        />
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          autoComplete="off"
          {...emailInput}
        />
        <TextField
          id="education-institute"
          label="Education institute"
          variant="outlined"
          {...educationInstituteInput}
        />
        <TextField
          id="current-employer"
          label="Current Employer"
          variant="outlined"
          {...employerInput}
        />
        <TextField
          id="password"
          type="password"
          label="Password"
          variant="outlined"
          {...passwordInput}
        />
        <TextField
          id="conformpassword"
          type="password"
          label="Conform Password"
          variant="outlined"
          {...confPasswordInput}
        />
        <Button variant="outlined" type="submit">
          SignUp
        </Button>
        <Button variant="outlined" onClick={() => setPage("LogIn")}>
          LogIn
        </Button>
      </Stack>
    </form>
  );
}

export default SignUp;
