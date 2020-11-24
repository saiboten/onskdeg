import styled from "styled-components";
import colors from "../../styles/colors";
import { ReactComponent as LinkIcon } from "../images/link.svg";

export const StyledLink = styled.a`
  padding: 0 0.5rem;
  transform: translateY(3px);
`;

export const StyledLinkIcon = styled(LinkIcon)`
  fill: ${colors.primaryLight};
  height: 32px;
  width: 32px;
`;
