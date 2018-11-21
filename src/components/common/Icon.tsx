import React from 'react';

import './Icon.scss';

interface IconProps {
  name: string;
  type: string;
  onClick: (args: any) => void;
  className?: string;
}
/* eslint-disable react/button-has-type */
export default function Icon({ name, type, onClick, className: classFromProps, ...rest }: IconProps) {
  const classes = classFromProps ? `${classFromProps} icon` : 'icon';
  return (
    <button type={type} className={classes} onClick={onClick} {...rest}>
      <svg className="icon__icon" fill="currentColor">
        <use xlinkHref={`/svg/sprite.svg#icon-${name}`} />
      </svg>
    </button>
  );
}
/* eslint-enable react/button-has-type */
