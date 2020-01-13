import styled from "styled-components";

export const StyledInput = styled.input`
  height: 48px;
  padding: 0 10px;
  padding-left: 40px;
  width: calc(100% - 1.6rem);
  margin: 0 0.8rem;
  border-radius: 10px;
  border: none;
  @media only screen and (min-width: 37.5em) {
    flex: 1 0 70%;
  }

  &::placeholder {
    font-size: 1.6rem;
  }
`;
