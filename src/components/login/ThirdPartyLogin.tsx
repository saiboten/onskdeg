import React, { useState } from "react";
import styled from "styled-components";

import { facebookProvider, googleProvider } from "../firebase/loginProviders";
import firebase from "../firebase/firebase";

import FbIcon from "./facebook-icon.svg?react";
import btn_google_signin_dark_normal_web from "../images/btn_google_signin_dark_normal_web.png";
import Spinner from "../common/Spinner";
import { Link } from "../common/Link";
import { BorderButton } from "../common/Button";
import { LoginWrapper } from "./LoginWrapper";

const iconHeight = "30px";
const FacebookIcon = styled(FbIcon)`
  font-size: 1em;
  height: ${iconHeight};
  width: ${iconHeight};
  margin-right: 6px;
`;

const ButtonSpinner = styled(Spinner)`
  margin: 0 auto;
`;

const ThirdPartyLogin = () => {
  const [submittingFb, setSubmittingFb] = useState(false);
  const [submittingGoogle, setSubmittingGoogle] = useState(false);

  function loginFacebook(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setSubmittingFb(true);
    firebase.auth().signInWithRedirect(facebookProvider);
  }

  function loginGoogle(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setSubmittingGoogle(true);
    firebase.auth().signInWithPopup(googleProvider);
  }

  const SmButton = styled(BorderButton)`
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
  `;

  return (
    <>
      <SmButton onClick={loginFacebook}>
        {submittingFb ? (
          <ButtonSpinner />
        ) : (
          <>
            <FacebookIcon />
            Logg på med Facebook
          </>
        )}
      </SmButton>
      <SmButton onClick={loginGoogle}>
        {submittingGoogle ? (
          <ButtonSpinner />
        ) : (
          <img src={btn_google_signin_dark_normal_web} />
        )}
      </SmButton>
      <Link to="/internal">Passord/brukernavn?</Link>
    </>
  );
};

export default ThirdPartyLogin;
