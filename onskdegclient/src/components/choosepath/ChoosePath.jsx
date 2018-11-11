// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../common/container/Container';

require('./choosepath.scss');

const ChoosePath = () => (
  <Container>
    <div className="ChoosePath__header flex-row space-between">
      <h1>Hva vil du gjøre?</h1>
      <Link className="shrink button-navigation smallspace" to="/">Bytt bruker</Link>
    </div>
    <hr />

    <div className="ChoosePath__list">
      <Link className="smallspace button button--padded" to="/yours">Din ønskeliste</Link>
      <Link className="smallspace button button--padded" to="/others">Andres ønskelister</Link>
      {/* <Link className="smallspace button button--padded" to="/gifts">Dine gaver</Link> */}
    </div>
  </Container>
);

export default ChoosePath;
