import { useState, createContext } from "react";

export const messengerStateContext = createContext();
const intialState = {
  markMessageRead: {
    messageId: null,
    userId: null,
  },
  isToggle: false,
};

function MessengerStateProvider({ children }) {
  const [messengerState, setMessengerState] = useState(intialState);

  return (
    <messengerStateContext.Provider value={[messengerState, setMessengerState]}>
      {children}
    </messengerStateContext.Provider>
  );
}

export default MessengerStateProvider;
