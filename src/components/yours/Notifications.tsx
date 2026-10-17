import { useNotifications } from "../../hooks/useNotifications";
import { Spacer } from "../common/Spacer";
import { ALink } from "../common/Link";
import { redirect } from "react-router-dom";
import { Notification as NotificationType } from "../../types/types";
import firebase from "../firebase/firebase";

interface Props {
  myUid: string;
}

const Notification = ({ notification }: { notification: NotificationType }) => {
  async function handleClick() {
    await firebase
      .firestore()
      .collection("notifications")
      .doc(notification.id)
      .delete();
    redirect(notification.link);
  }

  return (
    <div className="mb-10 rounded-[0.8rem] border-2 border-solid p-10">
      <ALink onClick={handleClick}>{notification.message}</ALink>
    </div>
  );
};

export const Notifications = (props: Props) => {
  const { notifications } = useNotifications(props.myUid);

  if (notifications?.length == 0) {
    return null;
  }

  return (
    <>
      <Spacer />
      {notifications?.map((el) => (
        <Notification notification={el} />
      ))}
      <Spacer />
    </>
  );
};
