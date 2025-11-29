import styled, { keyframes } from "styled-components";

const StyledCircleContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

function getRandomInt(min: number, max: number) {
  var num = Math.floor(Math.random() * Math.floor(max));
  if (num < min) {
    num += min;
  }
  return num;
}

interface StyledCircleProps {
  size: string;
  top: string;
  left: string;
  scale: number;
}

const scaleInAndOut = keyframes`
  0% {
    transform: scale(1) translateY(0px) translateX(50px);
  }
  25% {
    transform: scale(1.2) translateY(200px) translateX(-50px)
  }
  50% {
    transform: scale(1) translateY(300px) translateX(200px);
  }
  75% {
    transform: scale(0.8) translateY(500px) translateX(-300px);
  }
`;

const StyledCircle = styled.div`
  background-color: ${(props) => props.theme.primary};
  border-radius: 50%;
  filter: opacity(0.5);
  position: absolute;
  width: ${(props: StyledCircleProps) => props.size};
  height: ${(props) => props.size};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  animation: ${scaleInAndOut} ${(props) => props.scale}s linear infinite
    alternate;
`;

export default function FloatingCircles() {
  const circles = Array(15)
    .fill(0)
    .map((_, index) => (
      <StyledCircle
        key={index}
        size={`${getRandomInt(50, 500)}px`}
        top={`${getRandomInt(0, 100)}%`}
        left={`${getRandomInt(0, 100)}%`}
        scale={getRandomInt(5, 30)}
      />
    ));

  return <StyledCircleContainer>{circles}</StyledCircleContainer>;
}
