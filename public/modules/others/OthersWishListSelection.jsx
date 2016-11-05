import React from 'react'
import Container from '../../common/container/Container';
import {Link} from 'react-router';
var firebase = require('../../common/firebase/firebase');
var user = require('../../common/User');
var debug = require('debug')('OthersWishListSelection')
var config = require('../../Config');
var AddableUsers = require('./AddableUsers');

export default React.createClass({

    getInitialState() {
        return {users: [], newUser: "", feedback: ""}
    },

    componentDidMount() {
        if (user.getUserUid() == undefined) {
            this.props.router.push('/')
        }
        debug('this.state.users', this.state.users);
        this.getUsers();
    },

    getUsers: function() {
        var that = this;

        var ref = firebase.database().ref('users/' + user.getUserUid());
        ref.on('value', function(snapshot) {
            if (snapshot.val() != null) {
                var list = snapshot.val().users;
                debug("data :", list);

                that.setState({users: list})
            }
        });
    },

    updateUserState: function(e) {
        this.setState({newUser: e.target.value})
    },

    addUserLinkClick(uid) {
        return firebase.database().ref('userlist').once('value').then(function(snapshot) {
            var users = snapshot.val();
            debug("Users: ", users);
            var userfromdb = users.filter(function(userdb) {
                debug("User from db: ", userdb);
                if (userdb.uid === uid) {
                    return true;
                } else {
                    return false;
                }
            })[0];

            debug("User form db: ", userfromdb);
            this.addUser(userfromdb.email);
        }.bind(this));
    },

    addUserClickEvent(e) {
      e.preventDefault();
      this.addUser(this.state.newUser);
    },

    addUser: function(newUserMail) {
        debug("Adding user: ", newUserMail);
        var wishesRef = firebase.database().ref('userlist');
        var that = this;

        return firebase.database().ref('/userlist').once('value').then(function(snapshot) {
            var users = snapshot.val();
            debug("Users: ", users);

            var userfromdb = users.filter(function(userdb) {
                if (userdb.email === newUserMail) {
                    return true;
                } else {
                    return false;
                }
            })[0];

            debug("User from db : ", userfromdb);

            if (userfromdb) {
                if (that.state.users.filter(user => { return user.email === newUserMail }).length === 1) {
                    that.setState({feedback: "Brukeren er lagt til fra før"})
                } else if (newUserMail == user.getUserEmail()) {
                    that.setState({feedback: "Du har ikke lov å legge til deg selv"});
                } else {
                    var newList = that.state.users.concat([userfromdb]);

                    debug('New list: ', newList);
                    firebase.database().ref('users/' + user.getUserUid()).set({users: newList});
                    that.setState({newUser: ""})
                }
            } else {
                that.setState({feedback: "Denne brukeren finnes ikke"});
            }
        });

    },

    render() {

        var users = this.state.users.map(el => {
            return (
                <li>
                    <Link to={"/other/" + el.uid}>{el.email}</Link>
                </li>
            )
        });

        return <Container>
            <h1>Andres ønskeliste</h1>

            <h2>Velg bruker</h2>
            <ul>
                {users}
            </ul>

            <AddableUsers addUser={this.addUserLinkClick}/>

            <form onSubmit={this.addUserClickEvent}>
                <p>Legg til</p>
                <input value={this.state.newUser} onChange={this.updateUserState}></input>
                <input type="submit"/>
            </form>

            <p>{this.state.feedback}</p>

            <li>
                <Link to="/choosepath">Tilbake</Link>
            </li>
        </Container>
    }
})
