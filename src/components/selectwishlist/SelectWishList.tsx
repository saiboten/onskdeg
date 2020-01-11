import { connect, useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import AddedUserLink from "./addeduserlink/AddedUserLink";
import Container from "../common/container/Container";
import firebase from "../firebase/firebase";
import { loadFriends, setFriends } from "../../state/actions/friends";
import { User, FirebaseSnapshot } from "../../types/types";
import {
  deleteFriend as deleteFriendAction,
  addFriend as addFriendAction
} from "../../state/actions/friends";
import { P } from "../common/P";
import { Form } from "../common/Form";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 2rem;
  border-bottom: 1px solid black;
`;

interface P {}

interface S {
  newUser: string;
  feedback: string;
}

export const SelectWishList = function(props: P) {
  const [newUser, setNewUser] = useState("");
  const [feedback, setFeedback] = useState("");

  const selector = ({
    user,
    friends: { friends, loaded, loading, newFriend, userNotFound }
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
  });

  const result: any = useSelector(selector);

  const { friends, userNotFound, user } = result;

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

  const load = () => dispatch(loadFriends());

  const deleteFriend = (email: string) => {
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

  function deleteUser(email: string) {
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
        <Input
          placeholder="Legg inn e-post"
          value={newUser}
          onChange={e => setNewUser(e.target.value)}
        />
        <Button type="submit">OK</Button>
      </Form>

      {userNotFound && <p>Fant ikke bruker</p>}
      <p>{feedback}</p>
    </Container>
  );
};
