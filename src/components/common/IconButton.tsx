import Icon from "./Icon";
import styled, { keyframes } from "styled-components";

export const IconButton = styled(Icon)`
  height: 52px;
  width: 52px;
  max-height: 52px;
  max-width: 52px;
`;
export const NegativeIconButton = styled(IconButton)`
  background: ${(props) => props.theme.text};
`;
export const NeutralIconButton = styled(IconButton)`
  background: ${(props) => props.theme.text};
`;
export const GoldIconButton = styled(IconButton)`
  color: ${(props) => props.theme.text};
`;

export const StyledActionButtons = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-shrink: 0;
`;

const moveIn = keyframes`
from {
  transform: translateX(100%);
}

to {
  transform: translateX(0);
}
`;

export const StyledActionButtonsAnimated = styled(StyledActionButtons)`
  animation: ${moveIn} 0.2s ease-in;
`;
