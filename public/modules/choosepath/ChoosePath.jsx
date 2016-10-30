var React = require('react');

import { Link } from 'react-router';
import Container from '../../common/container/Container';

var ChoosePath = React.createClass( {
  render: function() {

    return (
      <Container>
        <h1>Velg</h1>
        <li><Link to="/yours">Din ønskeliste</Link></li>
          <li><Link to="/others">Andres ønskelister</Link></li>
          <li><Link to="/selectuser">Bytt bruker</Link></li>

      </Container>
    );
  }
})

module.exports = ChoosePath;
