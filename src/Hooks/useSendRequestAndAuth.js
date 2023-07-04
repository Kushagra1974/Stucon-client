import useSendRequest from "./useSendRequest"
import { useNavigate } from "react-router-dom"
import useGlobalState from "./useGlobalState";

function useSendRequestAndAuth(intialvalue) {
    const [data, loding, error, sendReq, setData] = useSendRequest(intialvalue)
    const setGlobalState = useGlobalState()[1];
    const navigate = useNavigate();
    const doAuth = (error) => {
        if (error === 'TOKEN_EXPIRED' ||
            error === 'SESSION_INVALID' ||
            error === 'SERVER_ERROR' ||
            error === "INVALID_CREDENTIAL") {
            setGlobalState((prev) => { return { ...prev, isAlert: true, alertMessage: error, isLogedIn: false } })
            navigate("/")
            localStorage.removeItem("stucon");
        }
    }

    const sendReqAndAuth = ({ url, body, headers, method }) => {
        sendReq({ url, body, headers, method, doAuth })
    }
    return [data, loding, error, sendReqAndAuth, setData]
}

export default useSendRequestAndAuth