import React from 'react';

import './Icon.scss';

/* eslint-disable react/button-has-type */
export default function Icon({ name, type, onClick, ...rest }: { name: string, type: string, onClick: any}) {
  return (
    <button type={type} className="icon" onClick={onClick} {...rest}>
      <svg className="icon__icon">
        <use xlinkHref={`/svg/sprite.svg#icon-${name}`} />
      </svg>
    </button>
  );
}
/* eslint-enable react/button-has-type */
