import styled from "styled-components";
import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";

export const Link = styled(RouterLink)`
  text-decoration: none;
  border-bottom: 2px solid ${(props) => props.theme.secondary};
  font-weight: 400;

  &:visited,
  &:link {
    color: ${(props) => props.theme.text};
  }
  &:hover {
    color: grey;
  }
`;

export const ALink = styled.a`
  text-decoration: none;
  border-bottom: 2px solid ${(props) => props.theme.secondary};
  font-weight: 400;

  &:visited,
  &:link {
    color: ${(props) => props.theme.text};
  }
  &:hover {
    color: ${(props) => props.theme.primary};
  }
`;

export const UnstyledLink = styled(RouterLink)`
  text-decoration: none;
  font-weight: 400;

  &:visited,
  &:link,
  &:hover {
    color: ${(props) => props.theme.text};
  }
`;

export const NavLink = styled(RouterNavLink)`
  background: ${(props) => props.theme.secondaryDark};
  color: ${(props) => props.theme.text};
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  font-size: 2rem;
  border-radius: 1.5rem;
  transition: all 0.2s ease-in-out;
  font-weight: 400;

  @media (max-width: 450px) {
    flex: 1;
    border-radius: 0;
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }

  &.selected {
    color: ${(props) => props.theme.text};
    background: ${(props) => props.theme.secondary};
    font-weight: 700;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

export const NavLinkRight = styled(NavLink)`
  @media (max-width: 450px) {
    border-radius: 0;
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }
`;

export default {
  Link,
  NavLink,
};
