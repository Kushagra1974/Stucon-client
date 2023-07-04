import { useState, createContext } from "react";

export const GlobalContext = createContext();

const intialState = {
  userName: "",
  isLogedIn: false,
  isLoding: false,
  isAlert: false,
  alertMessage: "",
};

function GlobalStateProvider({ children }) {
  const [globalState, setGlobalState] = useState(intialState);

  return (
    <GlobalContext.Provider value={[globalState, setGlobalState]}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalStateProvider;
