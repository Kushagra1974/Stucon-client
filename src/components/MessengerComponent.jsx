import { Box } from "@mui/material";
import ChatComponents from "./ChatComponents";
import MessengerStateProvider from "../Providers/MessengerStateProvider";
export default function MessengerComponent() {
  return (
    <Box sx={{ width: "100%" }}>
      <MessengerStateProvider>
        <ChatComponents></ChatComponents>
      </MessengerStateProvider>
    </Box>
  );
}
