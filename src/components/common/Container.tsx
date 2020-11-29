import styled from "styled-components";

interface ContainerProps {
  textLeft?: boolean;
}

export const Container = styled.div<ContainerProps>`
  max-width: 870px;
  margin: 1rem auto;
  font-size: 1.6rem;
  padding: 0 0.5rem;
  background-color: ${(props) => props.theme.background};

  text-align: ${(props) => (props.textLeft ? "left" : "center")};
  padding: 0.5rem;
  border-radius: 3px;
`;
