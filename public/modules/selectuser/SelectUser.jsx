import React from 'react'
import Container from '../../common/container/Container';
import { Link } from 'react-router';
var debug = require('debug')('YourWishList');
var user = require('../../common/User');
var firebase = require('../../common/firebase/firebase');
var facebook = require('../../common/firebase/facebooklogin');


require('./selectuser.css');

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
    var that = this;
    firebase.auth().signInWithEmailAndPassword(this.state.user, this.state.password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      debug("Errorcode: ", errorCode, "errorMessage", errorMessage);
      if(errorCode) {
        that.setState({
          feedback: "Klarte ikke å logge deg inn, beklager det."
        })
      }
    });
  },

  loginFacebook: function(e) {
    e.preventDefault();
    var that = this;
    firebase.auth().signInWithPopup(facebook).then(function(result) {
      debug("Login was apparently successful");
    }).catch(function(error) {
      debug("Facebook login failed: ", error);
      alert(error.code);
      alert(error.message);

      if(error) {
        that.setState({
          feedback: "Klarte ikke å logge deg inn med facebook, beklager det."
        })
      }
    });
  },

  logOut: function(e) {
    e.preventDefault();
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

    var nextPage = this.state.loggedInUser ? (<Link className="button" to="/choosepath">Gå videre</Link>) : "";
    var logoutLink = this.state.loggedInUser ? (<a className="button-navigation" onClick={this.logOut}>Logg ut</a>) : "";
    var loginForm = this.state.loggedInUser ? "": (
      <form className="select-user__form" onSubmit={this.logIn} >
        <label className="smallspace">Brukernavn</label><input className="smallspace" value={this.state.user} onChange={this.updateUserState}></input>
        <label className="smallspace">Passord</label><input type="password" className="smallspace" value={this.state.password} onChange={this.updatePasswordState}></input>
        <div className="flex-row space-between">
          <input className="button" type="submit" value="Logg inn" />
          <button className="button select-user__facebook-button" onClick={this.loginFacebook}>Logg inn <br />med facebook</button>
          </div>
      </form>
    );

    return <Container>
      <h1>Innlogging</h1>

    <p>Du er logget inn som: <strong>{this.state.loggedInUser}</strong></p>

     {loginForm}

    {this.state.feedback}

    <div className="flex-row space-between">
      {logoutLink}
      {nextPage}
      </div>

    </Container>
  }
})
