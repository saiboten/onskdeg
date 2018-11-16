import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as colors from '../../styles/colors';

const StyledLink = styled(Link)`
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

export default StyledLink;
