import React, { useState } from "react";
import styled from "styled-components";

import { useNotifications } from "../../hooks/useNotifications";
import { Spacer } from "../common/Spacer";
import { ALink } from "../common/Link";
import { redirect } from "react-router-dom";
import { Notification as NotificationType } from "../../types/types";
import firebase from "../firebase/firebase";

interface Props {
  myUid: string;
}

const StyledNotification = styled.div`
  border: 2px solid;
  border-radius: 0.8rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

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
    <StyledNotification>
      <ALink onClick={handleClick}>{notification.message}</ALink>
    </StyledNotification>
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
