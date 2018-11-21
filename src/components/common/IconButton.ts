import Icon from "./Icon";
import styled from "styled-components";
import colors from "../../styles/colors";

export const IconButton = styled(Icon)`
  height: 52px;
  width: 52px;
  max-height: 52px;
  max-width: 52px;
`;
export const NegativeIconButton = styled(IconButton)`
  background: ${colors.negative};
`;
export const NeutralIconButton = styled(IconButton)`
  background: ${colors.neutral};
`;
export const GoldIconButton = styled(IconButton)`
  color: ${colors.primaryLight};
`;

