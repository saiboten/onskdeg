import { useNotifications } from "../../hooks/useNotifications";
import { Bell, ChevronRight } from "lucide-react";
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
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full cursor-pointer items-center gap-12 rounded-[12px] border-2 border-solid border-secondary bg-primary px-16 py-12 text-left font-sans text-[1.5rem] text-text transition-colors hover:bg-secondary-dark"
    >
      <Bell size={20} className="shrink-0 text-secondary" />
      <span className="min-w-0 flex-1">{notification.message}</span>
      <ChevronRight size={18} className="shrink-0 opacity-60" />
    </button>
  );
};

export const Notifications = (props: Props) => {
  const { notifications } = useNotifications(props.myUid);

  if (!notifications?.length) {
    return null;
  }

  return (
    <div className="mb-24 flex flex-col gap-8">
      {notifications.map((el) => (
        <Notification key={el.id} notification={el} />
      ))}
    </div>
  );
};
