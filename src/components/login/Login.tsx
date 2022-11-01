import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Routes, Route } from "react-router-dom";

import firebase from "../firebase/firebase";
import ThirdPartyLogin from "./ThirdPartyLogin";
import { InternalLogin } from "./InternalLogin";
import FloatingCircles from "../common/FloatingCircles";
import { Link } from "../common/Link";
import { PrivacyPolicy } from "../PrivacyPolicy";
import { TermsOfService } from "../TermsOfService";
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
