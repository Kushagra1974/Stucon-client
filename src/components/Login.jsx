import { Stack, TextField, Button, Typography } from "@mui/material";
import useInput from "../Hooks/useInput";
import useGlobalState from "../Hooks/useGlobalState";
import { useNavigate } from "react-router-dom";

function Login({ setPage }) {
  const emailInput = useInput("");
  const passwordInput = useInput("");
  const [globalState, setGlobalState] = useGlobalState();
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (emailInput.value && passwordInput.value) {
      setGlobalState({ ...globalState, isLoding: true });

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              email: emailInput.value,
              password: passwordInput.value,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );
        const data = await response.json();
        const { token, user } = data;
        if (response.status === 201 || response.status === 200) {
          setGlobalState({
            isLoding: false,
            isLogedIn: true,
            userName: user.userName,
            ...globalState,
          });
          localStorage.setItem("stucon", JSON.stringify({ token, user }));
          navigate("/home");
        } else {
          setGlobalState({
            isLoding: false,
            isLogedIn: false,
            userName: "",
            isAlert: true,
            alertMessage: "Incorrect email or password",
          });
        }
      } catch (err) {
        // console.log(err);
        setGlobalState({
          isLoding: false,
          isLogedIn: false,
          userName: "",
          isAlert: true,
          message: "Incorrect email or password",
        });
      }
    } else {
      setGlobalState({
        ...globalState,
        alert: true,
        setAlert: "All feilds are required",
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
          borderRadius: 5,
          paddingTop: 3,
        }}
      >
        <Typography
          variant="body1"
          sx={{ color: "#1976d2", textAlign: "center" }}
        >
          LogIn
        </Typography>

        <TextField
          id="email"
          label="Email"
          variant="outlined"
          {...emailInput}
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          {...passwordInput}
        />
        <Button type="submit" variant="outlined">
          LogIn
        </Button>
        <Button variant="outlined" onClick={() => setPage("SignUp")}>
          SignIn
        </Button>
      </Stack>
    </form>
  );
}

export default Login;
