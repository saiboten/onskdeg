// @flow

import React from 'react';
import { any } from 'prop-types';
import { Link } from 'react-router-dom';
import Container from '../common/container/Container';

const debug = require('debug')('ChoosePath');

require('./choosepath.scss');

class ChoosePath extends React.Component {
  componentDidMount() {
    debug('componentDidMount');
    const { users, user, router } = this.props;

    users.forEach((dbuser) => {
      if (user.uid === dbuser.uid && !dbuser.name) {
        debug('No user name sat. Redirecting to name selection');
        router.push('/nameselect');
      }
    });
  }

  render() {
    return (
      <Container>
        <div className="ChoosePath__header flex-row space-between">
          <h1>Hva vil du gjøre?</h1>
          <Link className="shrink button-navigation smallspace" to="/">Bytt bruker</Link>
        </div>
        <hr />

        <div className="ChoosePath__list">
          <Link className="smallspace button button--padded" to="/yours">Din ønskeliste</Link>
          <Link className="smallspace button button--padded" to="/others">Andres ønskelister</Link>
          <Link className="smallspace button button--padded" to="/gifts">Dine gaver</Link>
        </div>
      </Container>
    );
  }
}

ChoosePath.propTypes = {
  router: any,
  users: [],
  user: any,
};

export default ChoosePath;
