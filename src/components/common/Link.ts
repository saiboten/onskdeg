import styled from "styled-components";
import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";

export const Link = styled(RouterLink)`
  text-decoration: none;
  border-bottom: 2px solid ${(props) => props.theme.primary};
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
  border-bottom: 2px solid ${(props) => props.theme.primary};
  font-weight: 400;

  &:visited,
  &:link {
    color: ${(props) => props.theme.text};
  }
  &:hover {
    color: ${(props) => props.theme.primaryDark};
  }
`;

export const UnstyledLink = styled(RouterLink)`
  text-decoration: none;
  font-weight: 400;

  &:visited,
  &:link {
    color: ${(props) => props.theme.text};
  }
  &:hover {
    color: ${(props) => props.theme.primaryDark};
  }
`;

export const NavLink = styled(RouterNavLink)`
  background: ${(props) => props.theme.primaryDark};
  color: ${(props) => props.theme.text};
  text-decoration: none;
  padding: 1rem 2rem;
  font-size: 2.5rem;
  border-radius: 1.5rem;

  &.selected {
    color: ${(props) => props.theme.text};
    background: ${(props) => props.theme.primary};
  }
`;

export default {
  Link,
  NavLink,
};
