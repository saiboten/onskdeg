import styled from 'styled-components';
import colors from '../../styles/colors';

const BorderStyles = `
  border: 2px solid ${colors.gold};
  padding: 7px 14px;
  background: transparent;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
  color: white;
  max-width: 300px;
  min-height: 48px;
  margin-bottom: 16px;
`;

export const BorderButton = styled.button`
  ${BorderStyles}
`;

export const BorderInput = styled.input`
  ${BorderStyles}
`;

export default {
  BorderButton,
  BorderInput,
}