import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import firebase from "../firebase/firebase";
import ThirdPartyLogin from "./ThirdPartyLogin";
import { InternalLogin } from "./InternalLogin";
import FloatingCircles from "../common/FloatingCircles";
import { Link } from "../common/Link";
import { PrivacyPolicy } from "../PrivacyPolicy";
import { TermsOfService } from "../TermsOfService";

const StyledParagraph = styled.p`
  font-size: 3rem;
  margin: 2rem;
`;

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  height: 100%;
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

  const H1 = styled.h1`
    color: white;
    font-weight: 400;
    margin: 4rem 0;
  `;

  return (
    <BrowserRouter>
      <LoginContainer>
        <H1>
          <Link to="/">GAVEØNSKE.NO</Link>
        </H1>
        <Switch>
          <Route path="/tos" component={TermsOfService} />
          <Route path="/privacypolicy" component={PrivacyPolicy} />
          <Route path="/internal" component={InternalLogin} />
          <Route component={ThirdPartyLogin} />
        </Switch>
        <StyledParagraph>{feedback}</StyledParagraph>
        <Link to="/privacypolicy">Privacy Policy</Link>
        <Link to="/tos">Terms of Service</Link>
        <FloatingCircles />
      </LoginContainer>
    </BrowserRouter>
  );
};
