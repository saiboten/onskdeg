import styled from "styled-components";

export const StyledInput = styled.input`
  font-size: 2.4rem;
  height: 48px;
  padding: 3rem;
  padding-left: 40px;
  width: 100%;
  border-radius: 5rem;
  border: none;
  font-size: 1.6rem;
  flex: 1;
  background-color: ${(props) => props.theme.primaryLight};

  &::placeholder {
    font-size: 1.6rem;
  }
`;
