import React, { useState, useEffect } from "react";
import { func, any } from "prop-types";
import firebase from "../../firebase/firebase";
import { User } from "../../../types/types";

interface P {
  user: User;
  addUser: (uid: string) => void;
}

interface S {
  open: boolean;
  userlist: Array<User>;
}

const AddableUsers = (props: P) => {
  const { user, addUser: addUserProp } = props;
  const [userlist, setUserlist] = useState<User[]>([]);
  const [open, setOpen] = useState(false);

  function userInList(uid: string, userlist: Array<User>) {
    if (!userlist) {
      return undefined;
    }

    return userlist.filter(userInList => userInList.uid === uid).length === 1;
  }

  useEffect(() => {
    firebase
      .database()
      .ref("userlist")
      .on("value", data => {
        if (!data) {
          return;
        }
        const userlist = data.val();

        firebase
          .database()
          .ref(`users/${user.uid}`)
          .on("value", snapshot => {
            if (!snapshot) {
              return null;
            }

            const addedUsers = snapshot.val()
              ? snapshot.val().users
              : undefined;
            const filteredUserList = userlist.filter((dbuser: User) => {
              if (dbuser.uid === user.uid) {
                return false;
              }
              if (userInList(dbuser.uid, addedUsers)) {
                return false;
              }
              return true;
            });

            setUserlist(filteredUserList);
          });
      });
  }, []);

  function addUser(e: React.MouseEvent<HTMLElement>, userUid: string) {
    e.preventDefault();
    addUserProp(userUid);
  }

  function clearList() {
    setUserlist([]);
  }

  function toggleOpen() {
    setOpen(!open);
  }

  const addableUsers = userlist.map(userInList => (
    <button
      type="button"
      className="addable-users__list-element border space button"
      onClick={e => {
        addUser(e, userInList.uid);
      }}
    >
      {userInList.name}
    </button>
  ));

  const content = open ? (
    <div className="addable-users__list">{addableUsers}</div>
  ) : (
    ""
  );

  return (
    <div>
      <button
        type="button"
        className="button addable-users__expand-button smallspace"
        onClick={toggleOpen}
      >
        {open ? "-" : "+"}
      </button>
      {content}
    </div>
  );
};

export default AddableUsers;
