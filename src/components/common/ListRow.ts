import styled from 'styled-components';
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
`;
export const ListRow = styled.div`
  ${ListRowStyles}
`;

export default ListRow;