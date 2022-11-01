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
  &:link {
    color: ${(props) => props.theme.text};
  }
  &:hover {
    color: ${(props) => props.theme.primary};
  }
`;

export const NavLink = styled(RouterNavLink)<{
  activeClassName: string;
  isActive: (_: any, location: any) => any;
  exact?: boolean;
}>`
  background: ${(props) => props.theme.secondaryDark};
  color: ${(props) => props.theme.text};
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  font-size: 2rem;
  border-radius: 1.5rem;

  @media (max-width: 450px) {
    flex: 1;
    border-radius: 0;
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }

  &.selected {
    color: ${(props) => props.theme.text};
    background: ${(props) => props.theme.secondary};
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
