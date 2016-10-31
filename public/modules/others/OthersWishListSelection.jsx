import React from 'react'
import Container from '../../common/container/Container';
import {Link} from 'react-router';
var Gun = require('gun/gun');
var user = require('../../common/User');
var debug = require('debug')('OthersWishListSelection')

export default React.createClass({

    getInitialState() {
        return {
          users: [],
          newUser: ""
        }
    },

    componentDidMount() {
      debug('this.state.users',this.state.users);
        var peers = ["/gun"];
        this.gun = Gun(peers);
        this.getUsers();
    },

    getUsers: function() {
        var that = this;
        this.gun.get('users/' + user.getUser().toLowerCase(), function(error, data) {
            console.log("GUN data: ", error, data);

            if (error) {
                debug('Error: ', error);
            } else if (data) {
                var list = JSON.parse(data.users);
                console.log("Data retrieved: ", list);
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
        this.gun.put({users: JSON.stringify(newList)}).key('users/' + user.getUser().toLowerCase());
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
