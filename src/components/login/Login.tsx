import React, { useState } from "react";
import styled from "styled-components";
import { Eye, EyeOff } from "lucide-react";

import firebase from "../firebase/firebase";
import { googleProvider } from "../firebase/loginProviders";
import Spinner from "../common/Spinner";
import { LoginWrapper } from "./LoginWrapper";

const Card = styled.div`
  width: 100%;
  max-width: 40rem;
  padding: 3.6rem 3.2rem;
  border-radius: 2.4rem;
  background: rgba(41, 37, 71, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  text-align: left;

  @media (max-width: 450px) {
    padding: 2.8rem 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2.6rem;
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  opacity: 0.7;
  text-align: center;
  margin: 0.4rem 0 2.8rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  width: 100%;
  height: 4.8rem;
  border: 0;
  border-radius: 1.2rem;
  background: #ffffff;
  color: #1f1f1f;
  font-family: inherit;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin: 2.4rem 0;
  font-size: 1.3rem;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  opacity: 0.6;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: currentColor;
    opacity: 0.4;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Label = styled.label`
  font-size: 1.4rem;
  font-weight: 600;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  height: 4.8rem;
  padding: 0 1.6rem;
  border-radius: 1.2rem;
  border: 2px solid transparent;
  outline: none;
  background: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.text};
  font-size: 1.6rem;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    border-color: ${(props) => props.theme.secondary};
  }
`;

const PasswordInput = styled(Input)`
  padding-right: 5rem;
`;

const PeekButton = styled.button`
  position: absolute;
  top: 50%;
  right: 1.2rem;
  transform: translateY(-50%);
  display: flex;
  padding: 0.4rem;
  border: 0;
  background: transparent;
  color: ${(props) => props.theme.text};
  opacity: 0.7;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4.8rem;
  margin-top: 0.8rem;
  border: 0;
  border-radius: 1.2rem;
  background: ${(props) => props.theme.secondary};
  color: ${(props) => props.theme.white};
  font-family: inherit;
  font-size: 1.6rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

const ErrorMessage = styled.p`
  margin-top: 2rem;
  padding: 1.2rem 1.6rem;
  border-radius: 1.2rem;
  background: rgba(255, 86, 86, 0.15);
  color: #ffb3b3;
  font-size: 1.4rem;
  text-align: center;
`;

const SmallSpinner = styled(Spinner)`
  margin: 0 auto;
`;

const DarkSpinner = styled(SmallSpinner)`
  &::after {
    border-color: #1f1f1f transparent #1f1f1f transparent;
  }
`;

const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

function errorText(code: string | undefined): string {
  switch (code) {
    case "auth/invalid-email":
      return "E-postadressen er ikke gyldig.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Feil e-post eller passord.";
    case "auth/too-many-requests":
      return "For mange forsøk. Vent litt og prøv igjen.";
    case "auth/popup-blocked":
      return "Nettleseren blokkerte innloggingsvinduet. Tillat popup-vinduer og prøv igjen.";
    default:
      return "Klarte ikke å logge deg inn, beklager det.";
  }
}

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [peek, setPeek] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittingGoogle, setSubmittingGoogle] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);

  function loginGoogle() {
    setErrorMessage("");
    setSubmittingGoogle(true);
    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .catch((error: any) => {
        if (
          error.code !== "auth/popup-closed-by-user" &&
          error.code !== "auth/cancelled-popup-request"
        ) {
          setErrorMessage(errorText(error.code));
        }
        setSubmittingGoogle(false);
      });
  }

  function loginPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setSubmittingPassword(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error: any) => {
        setErrorMessage(errorText(error.code));
        setSubmittingPassword(false);
      });
  }

  const submitting = submittingGoogle || submittingPassword;

  return (
    <LoginWrapper>
      <Card>
        <Title>Velkommen!</Title>
        <Subtitle>Logg inn for å se og dele ønskelister</Subtitle>

        <GoogleButton type="button" onClick={loginGoogle} disabled={submitting}>
          {submittingGoogle ? (
            <DarkSpinner />
          ) : (
            <>
              <GoogleLogo />
              Fortsett med Google
            </>
          )}
        </GoogleButton>

        <Divider>eller</Divider>

        <Form onSubmit={loginPassword}>
          <Field>
            <Label htmlFor="email">E-post</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="navn@eksempel.no"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field>
            <Label htmlFor="password">Passord</Label>
            <InputWrapper>
              <PasswordInput
                id="password"
                type={peek ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PeekButton
                type="button"
                onClick={() => setPeek(!peek)}
                aria-label={peek ? "Skjul passord" : "Vis passord"}
              >
                {peek ? <EyeOff size={20} /> : <Eye size={20} />}
              </PeekButton>
            </InputWrapper>
          </Field>

          <SubmitButton type="submit" disabled={submitting}>
            {submittingPassword ? <SmallSpinner /> : "Logg inn"}
          </SubmitButton>
        </Form>

        {errorMessage && <ErrorMessage role="alert">{errorMessage}</ErrorMessage>}
      </Card>
    </LoginWrapper>
  );
};
