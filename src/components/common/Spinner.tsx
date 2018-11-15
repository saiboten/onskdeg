import styled, { keyframes } from 'styled-components';

const spinnerKeyframe = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  &::after {
    content: " ";
    display: block;
    width: 24px;
    height: 24px;
    transform: translateY(50%);
    border-radius: 50%;
    border: 3px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: ${spinnerKeyframe} 1.2s linear infinite;
  }
`;

export default Spinner;
