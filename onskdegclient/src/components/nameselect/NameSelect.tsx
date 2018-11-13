// @flow

import React from 'react';
import { array, any } from 'prop-types';
import { Link } from 'react-router-dom';

import Container from '../common/container/Container';
import firebase from '../firebase/firebase';
import store from '../../store';

const debug = require('debug')('NameSelect');

require('./nameselect.css');

class NameSelect extends React.Component {
  constructor() {
    super();
    debug('constructor');

    this.state = {
      name: '',
      confirmedName: '',
    };

    this.nameSelected = this.nameSelected.bind(this);
    this.updateNameState = this.updateNameState.bind(this);
  }

  componentDidMount() {
    debug('componentDidMount');

    const { user, router } = this.props;

    if (user.uid === undefined) {
      router.push('/');
    }
  }

  nameSelected(e/* : Event */) {
    debug('nameSelected', e);
    const { user } = this.props;
    const { name } = this.state;

    e.preventDefault();
    debug('Name selected: ', name);

    this.setState({
      confirmedName: name,
    });

    const users = store.getState().allUserReducer;

    const newUsers = users.map((el) => {
      const copyOfEl = Object.assign({}, el);
      if (el.email === user.email) {
        copyOfEl.name = name;
        debug('Found the user. New user values: ', name, el);
      }
      return copyOfEl;
    });

    debug('New userlist after name selection : ', newUsers);

    firebase.database().ref('/userlist').set(newUsers);
  }

  updateNameState(e/* : Event */) {
    debug('updateNameState', e);
    this.setState({
      name: e.target.value,
    });
  }

  render() {
    const { name, confirmedName } = this.state;

    const continueLink = confirmedName === ''
      ? '' : (<Link className="button" to="/yours">Fortsett</Link>);
    const input = confirmedName === '' ? (
      <div className="flex-row space-between">
        <input
          className="space shrink smallspace"
          value={name}
          onChange={this.updateNameState}
          placeholder="Skriv navn her"
        />

        <input className="button grow smallspace" type="submit" value="OK" />
      </div>) : (
        <div>
Ditt brukernavn er:
          {' '}
          {confirmedName}
        </div>
    );

    return (
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
}

NameSelect.propTypes = {
  router: array,
  user: any,
};

export default NameSelect;
