import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";

import AddedUserLink from "./AddedUserLink";
import Container from "../common/Container";
import firebase from "../firebase/firebase";
import { setFriends } from "../../state/actions/friends";
import { User, FirebaseSnapshot } from "../../types/types";
import {
  deleteFriend as deleteFriendAction,
  addFriend as addFriendAction
} from "../../state/actions/friends";
import { P } from "../common/P";
import { Form } from "../common/Form";
import { StyledInput } from "../common/StyledInput";
import { Button } from "../common/Button";

interface P {}

export const SelectWishList = function(props: P) {
  const [newUser, setNewUser] = useState("");

  const { friends, userNotFound, user } = useSelector(
    ({
      user,
      friends: { friends, newFriend, userNotFound }
    }: {
      user: User;
      friends: {
        friends: Array<User>;
        loaded: boolean;
        loading: boolean;
        newFriend: User;
        userNotFound: boolean;
      };
    }) => ({
      newFriend,
      userNotFound,
      user,
      friends
    })
  );

  const { uid } = user;

  let firebaseRef: any = null;

  useEffect(() => {
    firebaseRef = firebase.database().ref(`users/${uid}/friends`);
    firebaseRef.on("value", (snapshot: FirebaseSnapshot) => {
      updateFriendStore(snapshot.val());
    });

    return () => {
      firebaseRef.off();
    };
  }, []);

  const dispatch = useDispatch();

  const deleteFriend = (email: string | null) => {
    dispatch(deleteFriendAction(email));
  };

  function updateFriendStore(newFriendList: Array<User>) {
    dispatch(setFriends(newFriendList));
  }
  function addFriend(newFriendMail: string) {
    dispatch(addFriendAction(newFriendMail));
  }

  function addUserClickEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    addFriend(newUser);
    setNewUser("");
  }

  function deleteUser(email: string | null) {
    deleteFriend(email);
  }

  const usersLinks =
    friends != null
      ? friends.map((el: User) => (
          <AddedUserLink key={el.uid} deleteMe={deleteUser} el={el} />
        ))
      : null;

  return (
    <Container>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch"
        }}
      >
        {usersLinks}
      </div>

      <Form onSubmit={addUserClickEvent}>
        <P>Legg til bruker</P>

        <StyledInput
          style={{
            marginBottom: "1rem"
          }}
          placeholder="Legg inn e-post"
          value={newUser}
          onChange={e => setNewUser(e.target.value)}
        />
        <Button type="submit">OK</Button>
      </Form>

      {userNotFound && <p>Fant ikke bruker</p>}
    </Container>
  );
};
