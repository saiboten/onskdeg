import React, { useState } from "react";
import styled from "styled-components";

import facebook from "../firebase/facebooklogin";
import firebase from "../firebase/firebase";

import { ReactComponent as FbIcon } from "./facebook-icon.svg";
import Spinner from "../common/Spinner";
import { Link } from "../common/Link";
import { BorderButton } from "../common/Button";

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
  const [submitting, setSubmitting] = useState(false);

  function loginFacebook(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setSubmitting(true);
    firebase.auth().signInWithRedirect(facebook);
  }

  const SmButton = styled(BorderButton)`
    display: flex;
    align-items: center;
    width: 100%;
  `;

  return (
    <>
      <SmButton onClick={loginFacebook}>
        {submitting ? (
          <ButtonSpinner />
        ) : (
          <>
            <FacebookIcon />
            Logg på med Facebook
          </>
        )}
      </SmButton>
      <Link to="/internal">Passord/brukernavn?</Link>
    </>
  );
};

export default ThirdPartyLogin;
