import styled from "styled-components";

interface ContainerProps {
  textLeft?: boolean;
}

export const Container = styled.div<ContainerProps>`
  max-width: 870px;
  margin: 0 auto;
  font-size: 1.6rem;

  text-align: ${(props) => (props.textLeft ? "left" : "center")};
`;
