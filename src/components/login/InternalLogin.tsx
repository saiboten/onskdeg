import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "../common/Link";
import { BorderInput } from "../common/Button";
import firebase from "../firebase/firebase";
import { Eye, EyeOff } from "lucide-react";
import { LoginWrapper } from "./LoginWrapper";

const StyledInput = styled.input`
  height: 2.5rem;
  outline: none;
  padding: 0 1rem;
  margin-bottom: 12px;
  border: 0;
  -webkit-appearance: none;
  background: ${(props) => props.theme.primary};
  color: white;
  width: 100%;
  &::placeholder {
    color: grey;
  }
`;

const SubmitButton = styled(BorderInput)`
  width: 100%;
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const StyledPeek = styled.button`
  position: absolute;
  border: 0;
  background-color: transparent;
  right: 15px;
  top: -8px;
  color: white;
`;

export const InternalLogin = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [peek, setPeek] = useState(false);

  function logIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(user, password)
      .catch((error: any) => {
        const errorCode = error.code;

        if (errorCode) {
          setErrorMessage("Klarte ikke å logge deg inn, beklager det.");
        }
      });
  }

  function togglePeek() {
    setPeek(!peek);
  }

  return (
    <LoginWrapper>
      <form onSubmit={logIn}>
        <label htmlFor="username" className="screen-reader-only">
          Brukernavn
        </label>
        <StyledInput
          id="username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Brukernavn"
        />

        <PasswordContainer>
          <label htmlFor="password" className="screen-reader-only">
            Passord
          </label>
          <StyledInput
            id="password"
            type={peek ? "text" : "password"}
            placeholder="Passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <StyledPeek type="button" onClick={togglePeek}>
            {peek ? <EyeOff size={24} /> : <Eye size={24} />}
          </StyledPeek>
        </PasswordContainer>

        <SubmitButton type="submit" value="Logg inn" />
        <p>{errorMessage}</p>
        <Link to="/">Google/Facebook</Link>
      </form>
    </LoginWrapper>
  );
};
