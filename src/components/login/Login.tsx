import { useEffect, useState } from "react";
import styled from "styled-components";

import firebase from "../firebase/firebase";
import ThirdPartyLogin from "./ThirdPartyLogin";
import { LoginWrapper } from "./LoginWrapper";

const StyledParagraph = styled.p`
  font-size: 3rem;
  margin: 2rem;
`;

export const Login = () => {
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    firebase
      .auth()
      .getRedirectResult()
      .then(() => {
        console.log("win?");
      })
      .catch((error) => {
        console.log("error. :-/", error);
        if (error) {
          setFeedback(
            `Klarte ikke å logge deg inn med facebook. Feil: ${error}`
          );
        }
      });
  }, []);

  return (
    <LoginWrapper>
      <StyledParagraph>{feedback}</StyledParagraph>
      <ThirdPartyLogin />
    </LoginWrapper>
  );
};
