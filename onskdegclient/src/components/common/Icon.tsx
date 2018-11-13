import React from 'react';
import { string } from 'prop-types';

import './Icon.scss';

/* eslint-disable react/button-has-type */
export default function Icon({ name, type, ...rest }) {
  return (
    <button type={type} className="icon" {...rest}>
      <svg className="icon__icon">
        <use xlinkHref={`/svg/sprite.svg#icon-${name}`} />
      </svg>
    </button>
  );
}
/* eslint-enable react/button-has-type */

Icon.propTypes = {
  name: string.isRequired,
  type: string.isRequired,
};
