import styled, { keyframes } from 'styled-components';
import colors from '../../styles/colors';

export const ListRowStyles = `
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${colors.primaryDark};
  color: white;
  padding-left: 50px;
  margin-bottom: 2px;
  height: 52px;
  white-space: nowrap;
`;
export const ListRow = styled.div`
  ${ListRowStyles}
`;

export const LeftSection = styled.div`
      display: flex;
      align-items: center;
      flex-shrink: 1;
      overflow: hidden;
    `;

export default ListRow;