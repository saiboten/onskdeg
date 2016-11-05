import React from 'react'
import Container from '../../common/container/Container';
import { Link } from 'react-router';
var debug = require('debug')('YourWishList');
var user = require('../../common/User');
var firebase = require('../../common/firebase/firebase');

export default React.createClass({

  getInitialState: function() {
    return {
      user: "",
      password: "",
      feedback: "",
      loggedInUser: ""
    }
  },

  componentDidMount() {
    var that = this;

    user.useThisCallback(function(user) {
      debug("User callback: ", user);
      that.setState({
        loggedInUser: user
      })
    });
  },

  updateUserState: function(e) {
    this.setState({
      user: e.target.value
    })
  },

  updatePasswordState: function(e) {
    this.setState({
      password: e.target.value
    })
  },

  logIn: function(e) {
    debug("Logging user in with the following credentials: ", this.state.user, this.state.password);
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.user, this.state.password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      debug("Errorcode: ", errorCode, "errorMessage", errorMessage);
      if(errorCode) {
        feedback: "Klarte ikke å logge deg inn, beklager det."
      }
    });
  },

  logOut: function() {
    var that = this;
    firebase.auth().signOut().then(function() {
      that.setState({
        feedback: "Du er nå logget ut",
        loggedInUser: ""
      })
    }, function(error) {
      that.setState({
        feedback: "Klarte ikke å logge deg ut, beklager det!"
      })
    });
  },

  render() {

    var nextPage = this.state.loggedInUser ? (<Link to="/choosepath">Gå videre</Link>) : "";
    var logoutLink = this.state.loggedInUser ? (<button onClick={this.logOut}>Logg ut</button>) : "";
    var loginForm = this.state.loggedInUser ? "": (
      <form onSubmit={this.logIn} >
        <div><label>Brukernavn</label><input value={this.state.user} onChange={this.updateUserState}></input></div>
        <div><label>Passord</label><input value={this.state.password} onChange={this.updatePasswordState}></input></div>
        <input type="submit" value="Logg inn" />
      </form>
    );

    return <Container>

    <p>Innlogget bruker:{this.state.loggedInUser}</p>

     {loginForm}

    {this.state.feedback}

    {logoutLink}

    <div>
      {nextPage}
    </div>

    </Container>
  }
})
