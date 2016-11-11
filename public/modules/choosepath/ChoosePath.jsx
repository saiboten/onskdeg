var React = require('react');

import { Link } from 'react-router';
import Container from '../../common/container/Container';
import { withRouter } from 'react-router';
var user = require('../../common/User');
import firebase from '../../common/firebase/firebase';
var debug = require('debug')('ChoosePath');


require('./choosepath.css')

var ChoosePath = React.createClass( {

  componentDidMount() {

    var username = "";
    firebase.database().ref('/userlist').once('value').then(function(snapshot) {
      var users = snapshot.val();
      var filteredUserList = users.filter(dbuser => {
       return user.getUserUid() === dbuser.uid; });
       debug("Filtered user list: ", filteredUserList[0].name);
       username = filteredUserList[0].name;

       if(!username) {
         this.props.router.push('/nameselect')
       }
    }.bind(this));

    if(user.getUserUid() == undefined) {
      this.props.router.push('/')
    }
  },

  render: function() {

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
