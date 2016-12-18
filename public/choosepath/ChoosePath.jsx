// @flow

import React from 'react';
import { Link, withRouter } from 'react-router';
import Container from '../common/container/Container';
import user from '../common/User';
import store from '../store';

const debug = require('debug')('ChoosePath');

require('./choosepath.css');

class ChoosePath extends React.Component {

  componentDidMount() {
    debug('componentDidMount');

    const username = '';
    const users = store.getState().allUserReducer;

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
        <h1>Velg</h1>
        <div className="ChoosePath__list">
          <Link className="smallspace button" to="/yours">Din ønskeliste</Link>
          <Link className="smallspace button" to="/others">Andres ønskelister</Link>
          <Link className="smallspace button" to="/">Bytt bruker</Link>
          <Link className="smallspace button" to="/gifts">Dine gaver</Link>


        </div>
      </Container>
    );
  }
}

ChoosePath.propTypes = {
  router: React.PropTypes.object,
};

module.exports = ChoosePath;
