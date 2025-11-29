import styled from "styled-components";
import LinkIcon from "../images/link.svg?react";

export const StyledLink = styled.a`
  padding: 0 0.5rem;
  transform: translateY(3px);
`;

export const StyledLinkIcon = styled(LinkIcon)`
  fill: ${(props) => props.theme.text};
  height: 32px;
  width: 32px;
`;
