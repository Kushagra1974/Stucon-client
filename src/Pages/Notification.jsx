import Authorized from "../components/Authorised";
import NotificationsComponent from "../components/NotificationsComponent";
function Notification() {
  return (
    <Authorized>
      <NotificationsComponent />
    </Authorized>
  );
}

export default Notification;
