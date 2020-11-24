import React from "react";
import styled from "styled-components";
import colors from "../../styles/colors";

const StyledIconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: transparent;
  border: none;
  cursor: pointer;

  height: 40px;
  width: 40px;
`;

const StyledSvg = styled.svg`
  max-height: 30px;
  max-width: 30px;
`;

interface IconProps {
  name: string;
  type: "button" | "submit" | "reset" | undefined;
  onClick: (args: any) => void;
  color?: string;
  className?: string;
}
/* eslint-disable react/button-has-type */
export default function Icon({
  name,
  type,
  onClick,
  color,
  className: classFromProps,
  ...rest
}: IconProps) {
  return (
    <StyledIconButton
      type={type}
      className={classFromProps}
      onClick={onClick}
      {...rest}
    >
      <StyledSvg fill={color || "currentColor"}>
        <use xlinkHref={`/svg/sprite.svg#icon-${name}`} />
      </StyledSvg>
    </StyledIconButton>
  );
}
/* eslint-enable react/button-has-type */
