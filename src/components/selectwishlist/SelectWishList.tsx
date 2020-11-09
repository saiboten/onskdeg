import React, { useEffect, useState } from "react";

import AddedUserLink from "./AddedUserLink";
import Container from "../common/Container";
import firebase from "../firebase/firebase";
import { User, FirebaseSnapshot } from "../../types/types";
import { P } from "../common/P";
import { Form } from "../common/Form";
import { StyledInput } from "../common/StyledInput";
import { Button } from "../common/Button";

interface P {}

export const SelectWishList = function (props: P) {
  // Todo list users

  return (
    <Container>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      ></div>
    </Container>
  );
};
