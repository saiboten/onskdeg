import { useNotifications } from "../../hooks/useNotifications";
import { ALink } from "../common/Link";
import { useNavigate } from "react-router-dom";
import { invalidate } from "../../queryClient";
import { Notification as NotificationType } from "../../types/types";
import firebase from "../firebase/firebase";

interface Props {
  myUid: string;
}

const Notification = ({ notification }: { notification: NotificationType }) => {
  const navigate = useNavigate();

  async function handleClick() {
    await firebase
      .firestore()
      .collection("notifications")
      .doc(notification.id)
      .delete();
    invalidate(["notifications", notification.to]);
    navigate(notification.link);
  }

  return (
    <div className="mb-10 rounded-[10px] border-2 border-solid border-secondary px-16 py-12 text-left">
      <ALink onClick={handleClick}>{notification.message}</ALink>
    </div>
  );
};

export const Notifications = (props: Props) => {
  const { notifications } = useNotifications(props.myUid);

  if (!notifications?.length) {
    return null;
  }

  return (
    <div className="mb-24">
      {notifications.map((el) => (
        <Notification key={el.id} notification={el} />
      ))}
    </div>
  );
};
