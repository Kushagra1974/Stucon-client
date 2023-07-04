import useGlobalState from "../Hooks/useGlobalState";
import SendIcon from "@mui/icons-material/Send";

import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";

function TextFeildBottom({ getMessage, isTyping }) {
  const globalState = useGlobalState()[0];
  const [message, setMessage] = useState("");
  return (
    <TextField
      disabled={globalState.isLoading}
      onChange={(e) => {
        setMessage(e.target.value);
      }}
      onFocus={(e) => {
        isTyping(true);
      }}
      onBlur={(e) => {
        isTyping(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          getMessage(message);
          setMessage("");
        }
      }}
      sx={{
        background: "white",
        zIndex: "1000",
        width: "100%",
        position: "absolute",
        bottom: 2,
      }}
      value={message}
      label="Send Message"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => {
                getMessage(message);
                setMessage("");
              }}
            >
              <SendIcon color="primary" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default TextFeildBottom;
