var debug = require('debug')('ChoosePath');

import React from 'react';
import { Link } from 'react-router';
import Container from '../common/container/Container';
import { withRouter } from 'react-router';
import user from '../common/User';
import store from '../store';

require('./choosepath.css')

var ChoosePath = React.createClass( {

  componentDidMount() {
    debug("componentDidMount");

    let username = "";
    let users = store.getState().allUserReducer;

    debug("Users: ", users);

    users.forEach(dbuser => {
       debug("User uid match? ", user.getUserUid(), dbuser.uid);
       if(user.getUserUid() === dbuser.uid && !dbuser.name) {
         debug("No user name sat. Redirecting to name selection");
          this.props.router.push('/nameselect')
       }
     });
  },

  render() {

    //<Link className="ChoosePath__anchor-link button" to="/">Bytt bruker</Link>

    return (
      <Container>
        <h1>Velg</h1>
        <div className="ChoosePath__list">
          <Link className="smallspace button" to="/yours">Din ønskeliste</Link>
          <Link className="smallspace button" to="/others">Andres ønskelister</Link>
          <Link className="smallspace button" to="/">Bytt bruker</Link>

        </div>
      </Container>
    );
  }
})

module.exports = ChoosePath;
