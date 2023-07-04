import { Alert, AlertTitle } from "@mui/material";

function AlertComponent({ message }) {
  return (
    <Alert
      severity="warning"
      sx={{
        zIndex: 1000,
        position: "absolute",
        top: "1.5%",
        left: "50%",
        transform: "translate(-50%, 0)",
        padding: "0.1% 1%",
      }}
    >
      <AlertTitle sx={{ margin: 0 }}>{message}</AlertTitle>
    </Alert>
  );
}

export default AlertComponent;
