import { useContext } from "react"
import { messengerStateContext } from "../Providers/MessengerStateProvider"

function useMessengerState() {
    const messengerState = useContext(messengerStateContext)
    return messengerState
}

export default useMessengerState