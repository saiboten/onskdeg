var React = require('react');

import { Link } from 'react-router';
import Container from '../common/container/Container';
import { withRouter } from 'react-router';
import user from '../common/User';
var debug = require('debug')('ChoosePath');
import store from '../store';

require('./choosepath.css')

var ChoosePath = React.createClass( {

  componentDidMount() {

    var username = "";
    var users = store.getState().allUserReducer;

    users.forEach(dbuser => {
       debug("User uid match? ", user.getUserUid(), dbuser.uid);

       if(user.getUserUid() === dbuser.uid && !dbuser.name) {
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
