var React = require('react');

import { Link } from 'react-router';
import Container from '../../common/container/Container';
import { withRouter } from 'react-router';
var user = require('../../common/User');

require('./choosepath.css')

var ChoosePath = React.createClass( {

  componentDidMount() {
    if(user.getUserUid() == undefined) {
      this.props.router.push('/')
    }
  },

  render: function() {

    return (
      <Container>
        <h1>Velg</h1>
        <div className="ChoosePath__list">
          <Link className="ChoosePath__anchor-link" to="/yours">Din ønskeliste</Link>
          <Link className="ChoosePath__anchor-link" to="/others">Andres ønskelister</Link>
          <Link className="ChoosePath__anchor-link" to="/">Bytt bruker</Link>
        </div>
      </Container>
    );
  }
})

module.exports = ChoosePath;
