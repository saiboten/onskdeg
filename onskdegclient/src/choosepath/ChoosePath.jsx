// @flow

import React from 'react';
import { any } from 'prop-types';
import { Link, withRouter } from 'react-router';
import Container from '../common/container/Container';
import store from '../store';

const debug = require('debug')('ChoosePath');

require('./choosepath.css');

class ChoosePath extends React.Component {

  componentDidMount() {
    debug('componentDidMount');

    const username = '';
    const { users, user } = this.props;
    debug('Users: ', users);

    users.forEach((dbuser) => {
      debug('User uid match? ', user.getUserUid(), dbuser.uid);
      if (user.getUserUid() === dbuser.uid && !dbuser.name) {
        debug('No user name sat. Redirecting to name selection');
        this.props.router.push('/nameselect');
      }
    });
  }

  render() {
    // <Link className="ChoosePath__anchor-link button" to="/">Bytt bruker</Link>

    return (
      <Container>
        <div className="flex-row space-between">
          <h1>Hva vil du gjøre?</h1>
          <Link className="shrink button-navigation smallspace" to="/">Bytt bruker</Link>
        </div>
        <hr />

        <div className="ChoosePath__list">
          <Link className="smallspace button" to="/yours">Din ønskeliste</Link>
          <Link className="smallspace button" to="/others">Andres ønskelister</Link>
          <Link className="smallspace button" to="/gifts">Dine gaver</Link>
        </div>
      </Container>
    );
  }
}

ChoosePath.propTypes = {
  router: any,
  users: [],
  user: any
};

export default ChoosePath;
