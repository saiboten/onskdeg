import styled from "styled-components";

export const StyledInput = styled.input`
  font-size: 2.4rem;
  height: 48px;
  padding: 3rem;
  padding-left: 40px;
  width: 100%;
  margin: 0 0.8rem;
  border-radius: 5rem;
  border: none;
  font-size: 1.6rem;
  flex: 1;
  background-color: ${(props) => props.theme.primaryLightest};

  &::placeholder {
    font-size: 1.6rem;
  }
`;
