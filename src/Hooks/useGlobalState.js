import { useContext } from "react"
import { GlobalContext } from "../Providers/GlobalStateProvider"


function useGlobalState() {
    const [globalState, setGlobalSate] = useContext(GlobalContext)
    return [globalState, setGlobalSate]
}

export default useGlobalState