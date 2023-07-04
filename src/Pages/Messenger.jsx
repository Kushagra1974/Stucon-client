import Authorized from "../components/Authorised";
import MessengerComponent from "../components/MessengerComponent";

function Messenger() {
  return (
    <Authorized>
      <MessengerComponent />
    </Authorized>
  );
}

export default Messenger;
