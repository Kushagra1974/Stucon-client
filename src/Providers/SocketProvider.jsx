import io from "socket.io-client";
import { useRef, useEffect, createContext } from "react";

export const SocketContext = createContext();

function SocketProvider({ children }) {
  const socket = useRef(null);
  useEffect(() => {
    const Socket = io(import.meta.env.VITE_SOCKET_URL);
    socket.current = Socket.connect();
    // socket.current.on("connect", () => {});
    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [socket.current]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export default SocketProvider;
