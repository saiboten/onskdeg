import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import firebase from "../firebase/firebase";
import { googleProvider } from "../firebase/loginProviders";
import Spinner from "../common/Spinner";
import { LoginWrapper } from "./LoginWrapper";
import { cn } from "../../util/cn";

const lift =
  "cursor-pointer transition-[transform,box-shadow] duration-150 ease-[ease] enabled:hover:-translate-y-1 enabled:hover:shadow-[0_6px_16px_rgba(0,0,0,0.3)] disabled:cursor-default disabled:opacity-70";

const input =
  "h-48 w-full rounded-[1.2rem] border-2 border-solid border-transparent bg-primary px-16 text-[1.6rem] text-text outline-none transition-[border-color] duration-150 ease-[ease] placeholder:text-[rgba(255,255,255,0.4)] focus:border-secondary";

const dividerLine =
  "before:h-px before:flex-1 before:bg-current before:opacity-40 before:content-[''] after:h-px after:flex-1 after:bg-current after:opacity-40 after:content-['']";

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
      <div className="w-full max-w-400 rounded-[2.4rem] border border-solid border-[rgba(255,255,255,0.08)] bg-[rgba(41,37,71,0.75)] px-32 py-36 text-left shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-[12px] max-[450px]:px-20 max-[450px]:py-28">
        <h1 className="text-center text-[2.6rem] leading-[1.3] font-semibold">
          Velkommen!
        </h1>
        <p className="mx-0 mt-4 mb-28 text-center text-[1.5rem] opacity-70">
          Logg inn for å se og dele ønskelister
        </p>

        <button
          type="button"
          onClick={loginGoogle}
          disabled={submitting}
          className={cn(
            "flex h-48 w-full items-center justify-center gap-12 rounded-[1.2rem] border-0 bg-white text-[1.6rem] font-semibold text-[#1f1f1f] [font-family:inherit]",
            lift
          )}
        >
          {submittingGoogle ? (
            <Spinner className="mx-auto after:border-y-[#1f1f1f]" />
          ) : (
            <>
              <GoogleLogo />
              Fortsett med Google
            </>
          )}
        </button>

        <div
          className={cn(
            "my-24 flex items-center gap-12 text-[1.3rem] tracking-[0.1rem] uppercase opacity-60",
            dividerLine
          )}
        >
          eller
        </div>

        <form className="flex flex-col gap-16" onSubmit={loginPassword}>
          <div className="flex flex-col gap-6">
            <label className="text-[1.4rem] font-semibold" htmlFor="email">
              E-post
            </label>
            <input
              className={input}
              id="email"
              type="email"
              autoComplete="username"
              placeholder="navn@eksempel.no"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-6">
            <label className="text-[1.4rem] font-semibold" htmlFor="password">
              Passord
            </label>
            <div className="relative">
              <input
                className={cn(input, "pr-50")}
                id="password"
                type={peek ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                className="absolute top-1/2 right-12 flex -translate-y-1/2 cursor-pointer border-0 bg-transparent p-4 text-text opacity-70 hover:opacity-100"
                type="button"
                onClick={() => setPeek(!peek)}
                aria-label={peek ? "Skjul passord" : "Vis passord"}
              >
                {peek ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={cn(
              "mt-8 flex h-48 items-center justify-center rounded-[1.2rem] border-0 bg-secondary text-[1.6rem] font-bold text-white [font-family:inherit]",
              lift
            )}
          >
            {submittingPassword ? <Spinner className="mx-auto" /> : "Logg inn"}
          </button>
        </form>

        {errorMessage && (
          <p
            role="alert"
            className="mt-20 rounded-[1.2rem] bg-[rgba(255,86,86,0.15)] px-16 py-12 text-center text-[1.4rem] text-[#ffb3b3]"
          >
            {errorMessage}
          </p>
        )}
      </div>
    </LoginWrapper>
  );
};
