import styled from 'styled-components';
import { Link as RouterLink, NavLink as RouterNavLink } from 'react-router-dom';
import * as colors from '../../styles/colors';
import Color from 'color';

export const Link = styled(RouterLink)`
  text-decoration: none;
  border-bottom: 2px solid ${colors.gold};
  font-weight: 400;
  &:visited {
    color: white;
  }
  &:hover {
    color: grey;
  }
`;

export const NavLink = styled(RouterNavLink)`
  background: ${colors.goldDark};
  color: ${Color('white').darken(.3).string()};
  text-decoration: none;
  padding: .8rem;
  &.selected {
    color: white;
    background: ${colors.gold};
  }
`;

export default {
  Link,
  NavLink,
};
