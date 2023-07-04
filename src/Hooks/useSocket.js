import { useContext } from "react"

import { SocketContext } from "../Providers/SocketProvider";

function useSocket() {
    const socket = useContext(SocketContext)
    return socket
}

export default useSocket