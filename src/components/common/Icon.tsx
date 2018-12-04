import React from 'react';
import styled from 'styled-components';

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
  type: string;
  onClick: (args: any) => void;
  className?: string;
}
/* eslint-disable react/button-has-type */
export default function Icon({ name, type, onClick, className: classFromProps, ...rest }: IconProps) {
  return (
    <StyledIconButton type={type} className={classFromProps} onClick={onClick} {...rest}>
      <StyledSvg fill="currentColor">
        <use xlinkHref={`/svg/sprite.svg#icon-${name}`} />
      </StyledSvg>
    </StyledIconButton>
  );
}
/* eslint-enable react/button-has-type */
