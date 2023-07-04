import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import GlobalStateProvider from "./Providers/GlobalStateProvider";
import SocketProvider from "./Providers/SocketProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </GlobalStateProvider>
  </React.StrictMode>
);
