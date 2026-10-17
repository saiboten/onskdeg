import React from "react";
import styled from "styled-components";
import FloatingCircles from "../common/FloatingCircles";
import { UnstyledLink } from "../common/Link";

const Page = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 4rem 1.6rem 2.4rem;
  color: ${(props) => props.theme.text};
  background: radial-gradient(
      ellipse at top,
      ${(props) => props.theme.primary} 0%,
      transparent 60%
    ),
    ${(props) => props.theme.primaryDark};
`;

const Background = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.6;
`;

const Logo = styled(UnstyledLink)`
  font-size: 3.2rem;
  font-weight: 700;
  letter-spacing: 0.3rem;
  margin-bottom: 4rem;
`;

const Content = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const Footer = styled.footer`
  display: flex;
  gap: 2.4rem;
  margin-top: 4rem;
  font-size: 1.4rem;

  a:link,
  a:visited {
    color: ${(props) => props.theme.text};
    opacity: 0.7;
  }

  a:hover {
    opacity: 1;
  }
`;

export const LoginWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Page>
      <Background>
        <FloatingCircles />
      </Background>
      <Logo to="/">GAVEØNSKE.NO</Logo>
      <Content>{children}</Content>
      <Footer>
        <UnstyledLink to="/privacypolicy">Personvern</UnstyledLink>
        <UnstyledLink to="/tos">Vilkår</UnstyledLink>
      </Footer>
    </Page>
  );
};
