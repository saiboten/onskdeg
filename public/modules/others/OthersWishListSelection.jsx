import React from 'react'
import Container from '../../common/container/Container';
import {Link} from 'react-router';
var database = require('../../common/gun/gun');
var user = require('../../common/User');
var debug = require('debug')('OthersWishListSelection')
var config = require('../../Config');

export default React.createClass({

    getInitialState() {
        return {
          users: [],
          newUser: ""
        }
    },

    componentDidMount() {
      debug('this.state.users',this.state.users);
        this.getUsers();
    },

    getUsers: function() {
      var that = this;

      var ref = database.ref('users/' + user.getUser().toLowerCase());
      ref.on('value', function(snapshot) {
        if(snapshot.val() != null ) {
          var list = snapshot.val().users;
          debug("data :", list);

          that.setState({users: list})
        }
      });
    },

    updateUserState: function(e) {
        this.setState({newUser: e.target.value})
    },

    addUser: function(e) {
        e.preventDefault();
        var newList = this.state.users.concat([this.state.newUser]);

        debug('New list: ', newList);
        database.ref('users/' + user.getUser().toLowerCase()).set({users: newList});
        this.setState({users: this.state.users.concat([this.state.newUser]), newUser: ""});
    },

    render() {

        var users = this.state.users.map(el => {
            return (
                <li>
                    <Link to={"/other/" + el}>{el}</Link>
                </li>
            )
        });

        return <Container>Others Wish List

            <ul>
                {users}
            </ul>

            <form onSubmit={this.addUser}>
                <p>Legg til</p>
                <input value={this.state.newUser} onChange={this.updateUserState}></input>
                <input type="submit"/>
            </form>

            <li>
                <Link to="/">Tilbake</Link>
            </li>
        </Container>
    }
})
