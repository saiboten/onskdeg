// @flow
let debug = require('debug')('NameSelect');

import React from 'react';
import Container from '../common/container/Container';
import user from '../common/User';
import { Link } from 'react-router';
import store from '../store';
import {setUserlist} from '../users/userlistactions';
import firebase from '../firebase/firebase'

require('./nameselect.css');

let NameSelect = React.createClass({

  getInitialState() {
    debug("getInitialState");
    return {
      name: "",
      confirmedName: ""
    }
  },

  componentDidMount() {
    debug("componentDidMount");

    if(user.getUserUid() == undefined) {
      this.props.router.push('/')
    }
  },

  nameSelected(e: Event) {
    debug("nameSelected",e);

    e.preventDefault();
    debug("Name selected: ", this.state.name);

    this.setState({
      confirmedName: this.state.name
    });

    var users = store.getState().allUserReducer;

    var newUsers = users.map(el=> {
      if(el.email === user.getUserEmail()) {
        el.name = this.state.name;
        debug("Found the user. New user values: ",  this.state.name, el);
      }
      return el;
    });

    debug("New userlist after name selection : ", newUsers);

    firebase.database().ref('/userlist').set(newUsers);
  },

  updateNameState(e: Event) {
    debug("updateNameState",e);
      this.setState({
        name: e.target.value
      })
  },

  render() {
    var continueLink = this.state.confirmedName === "" ? "": (<Link className="button" to="/choosepath">Fortsett</Link>);
    var input = this.state.confirmedName === "" ? (
        <div className="flex-row space-between">
          <input className="space shrink smallspace" value={this.state.name} onChange={this.updateNameState} placeholder="Skriv navn her" />
          <input className="button grow smallspace" type="submit" value="OK" />
        </div>) : (<div>Ditt brukernavn er: {this.state.confirmedName}</div>);

    return(
      <Container>
      <h1>Velg brukernavn</h1>
      <div className="flex-column">
        <form onSubmit={this.nameSelected}>
        {input}
        </form>
      </div>

      {continueLink}
      </Container>

    );
  }
});

module.exports = NameSelect;
