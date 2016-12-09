var debug = require('debug')('SelectUser');

import React from 'react';
import Container from '../common/container/Container';
import { Link } from 'react-router';
import user from '../common/User';
import firebase from '../firebase/firebase';
import facebook from '../firebase/facebooklogin';
import { connect } from 'react-redux';

require('./selectuser.css');

const mapStateToProps = function(state, ownProps) {
  debug("mapDispatchToProps: ", state, ownProps);
  return {
    userReducer: state.userReducer
  }
};


const mapDispatchToProps = (dispatch, ownProps) => (
  {}
)

let SelectUser =  React.createClass({

  getInitialState() {
    debug("getInitialState");

    return {
      user: "",
      password: "",
      feedback: ""    }
  },

  componentDidMount() {
    debug("componentDidMount");

    firebase.auth().getRedirectResult().then(function(result) {
      debug("Login was apparently successful");
    }).catch(error => {
      debug("Facebook login failed: ", error);
      //alert(error.code); - might be handy later
      //alert(error.message);

      if(error) {
        this.setState({
          feedback: "Klarte ikke å logge deg inn med facebook, beklager det."
        })
      }
    });
  },

  updateUserState(e) {
    debug("updateUserState",e);

    this.setState({
      user: e.target.value
    })
  },

  updatePasswordState(e) {
    debug("updatePasswordState",e);

    this.setState({
      password: e.target.value
    })
  },

  logIn(e) {
    debug("logIn",e);

    debug("Logging user in with the following credentials: ", this.state.user, this.state.password);
    e.preventDefault();

    this.setState({
      feedback: ""
    })

    firebase.auth().signInWithEmailAndPassword(this.state.user, this.state.password).catch(function(error) {
      let errorCode = error.code;
      let errorMessage = error.message;

      debug("Errorcode: ", errorCode, "errorMessage", errorMessage);

      if(errorCode) {
        this.setState({
          feedback: "Klarte ikke å logge deg inn, beklager det."
        })
      }
    }.bind(this));
  },

  loginFacebook(e) {
    debug("loginFacebook",e);

    e.preventDefault();
    firebase.auth().signInWithRedirect(facebook);
  },

  logOut(e) {
    debug("logOut",e);

    e.preventDefault();

    this.setState({
      feedback: "",
      password: ""
    })

    firebase.auth().signOut().then(function() {
      this.setState({
        feedback: "Du er nå logget ut"
      })
    }.bind(this), function(error) {
      this.setState({
        feedback: "Klarte ikke å logge deg ut, beklager det!"
      })
    }.bind(this));
  },

  render() {

    let loggedInAs = this.props.userReducer.uid ? (<p>Du er logget inn som: <strong>{this.props.userReducer.email}</strong></p>) : "";
    let logoutLink = this.props.userReducer.uid ? (<a className="button-navigation" onClick={this.logOut}>Logg ut</a>) : "";
    let nextPage = this.props.userReducer.uid ? (<Link className="button" to="/choosepath">Gå videre</Link>) : "";
    let loginForm = this.props.userReducer.uid ? "": (
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
      <h1>Logg inn</h1>

      {loggedInAs}

     {loginForm}

    {this.state.feedback}

    <div className="flex-row space-between">
      {logoutLink}
      {nextPage}
      </div>

    </Container>
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectUser)
