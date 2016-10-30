import React from 'react'
import Container from '../../common/container/Container';
import { Link } from 'react-router';
var debug = require('debug')('YourWishList');
var user = require('../../common/User');

export default React.createClass({

  gun: undefined,

  getInitialState: function() {
    return {
      user: user.getUser(),
      feedback: ""
    }
  },

  changeUser: function(e) {
    e.preventDefault();
    user.setUser(this.state.user);
    this.setState({
      feedback: "Du har nå byttet bruker!"
    })
  },

  updateUserState: function(e) {
    this.setState({
      user: e.target.value
    })
  },

  render() {

    return <Container>

    <form onSubmit={this.changeUser} >
      <input value={this.state.user} onChange={this.updateUserState}></input>
      <input type="submit" />
    </form>

    {this.state.feedback}

    <li><Link to="/">Tilbake</Link></li>

    </Container>
  }
})
