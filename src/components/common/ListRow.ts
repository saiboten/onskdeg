import styled from "styled-components";

export const ListRow = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props: any) => props.theme.primaryDark};
  color: white;
  padding-left: 50px;
  margin-bottom: 2px;
  min-height: 52px;
  text-align: left;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 1;
  overflow: hidden;
`;

export default ListRow;
