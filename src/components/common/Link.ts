import styled from "styled-components";
import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";
import colors from "../../styles/colors";
import Color from "color";

export const Link = styled(RouterLink)`
  text-decoration: none;
  border-bottom: 2px solid ${colors.primary};
  font-weight: 400;

  &:visited,
  &:link {
    color: white;
  }
  &:hover {
    color: grey;
  }
`;

export const ALink = styled.a`
  text-decoration: none;
  border-bottom: 2px solid ${colors.primary};
  font-weight: 400;

  &:visited,
  &:link {
    color: white;
  }
  &:hover {
    color: grey;
  }
`;

export const UnstyledLink = styled(RouterLink)`
  text-decoration: none;
  font-weight: 400;

  &:visited,
  &:link {
    color: white;
  }
  &:hover {
    color: grey;
  }
`;

export const NavLink = styled(RouterNavLink)`
  background: ${colors.primaryDark};
  color: ${Color("white").darken(0.3).string()};
  text-decoration: none;
  padding: 0.8rem;
  &.selected {
    color: white;
    background: ${colors.primary};
  }
`;

export default {
  Link,
  NavLink,
};
