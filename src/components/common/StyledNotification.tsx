import { useState } from "react";
import styled from "styled-components";

interface Props {
  active: boolean;
}

const StyledNotificationBar = styled.div<Props>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  border: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  background-color: ${(props) => props.theme.contrast};
  color: ${(props) => props.theme.text};
  padding: 1rem 0;

  transition: all 0.5s;
  transform: ${(props) =>
    props.active ? `translateY(0)` : `translateY(-50px)`};
`;

export const useNotification = (text: string) => {
  const [active, setActive] = useState(false);

  function flash() {
    setActive(true);
    setTimeout(() => {
      setActive(false);
    }, 2000);
  }

  return { flash, element: <StyledNotification active={active} text={text} /> };
};

export const StyledNotification = ({
  text,
  active,
}: {
  text: string;
  active: boolean;
}) => <StyledNotificationBar active={active}>{text}</StyledNotificationBar>;
