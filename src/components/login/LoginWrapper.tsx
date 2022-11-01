import React from "react";
import styled from "styled-components";
import FloatingCircles from "../common/FloatingCircles";
import { Link } from "../common/Link";
import { Spacer } from "../common/Spacer";

const H1 = styled.h1`
  color: white;
  font-weight: 400;
  margin: 4rem 0;
`;

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  height: 100%;
`;

export const LoginWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <LoginContainer>
      <H1>
        <Link to="/">GAVEØNSKE.NO</Link>
      </H1>
      {children}
      <Spacer />
      <Link to="/privacypolicy">Privacy Policy</Link>
      <Link to="/tos">Terms of Service</Link>
      <FloatingCircles />
    </LoginContainer>
  );
};
