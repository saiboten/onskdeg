import styled from "styled-components";
import { Link as LinkIcon } from "lucide-react";

export const StyledLink = styled.a`
  padding: 0 0.5rem;
  transform: translateY(3px);
`;

export const StyledLinkIcon = styled(LinkIcon)`
  color: ${(props) => props.theme.text};
  height: 32px;
  width: 32px;
`;
