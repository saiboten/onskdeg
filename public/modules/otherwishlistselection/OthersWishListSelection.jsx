import React from 'react'
import Container from '../../common/container/Container';
var firebase = require('../../common/firebase/firebase');
var user = require('../../common/User');
var debug = require('debug')('OthersWishListSelection')
var AddableUsers = require('./addableusers/AddableUsers');
var HTML5Backend = require('react-dnd-html5-backend');
import { default as TouchBackend } from 'react-dnd-touch-backend';

var DragDropContext = require('react-dnd').DragDropContext;
var AddedUserLink = require('./addeduserlink/AddedUserLink');
import {Link} from 'react-router';
var DeleteUserDropTarget = require('./DeleteUserDropTarget');

require('./otherswishlistselection.css');

var OthersWishListSelection = React.createClass({

    getInitialState() {
        return {
          users: [],
          newUser: "",
          feedback: ""
        }
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
            var userfromdb = snapshot.val().filter(function(userdb) {
                return userdb.uid === uid;
            })[0];
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

        return firebase.database().ref('userlist').once('value').then(function(snapshot) {
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

    deleteUser(email) {
      debug("Deleting user by email: ", email);
      var userList = Object.assign([], this.state.users);
      var newUserList = userList.filter(user=> {
        return user.email !== email
      });

      firebase.database().ref('users/' + user.getUserUid()).set({users: newUserList});
      if(newUserList.length == 0) {
        this.setState({
          users: []
        });
      }

    },

    render() {

        var users = this.state.users.map(el => {
            return (
              <AddedUserLink el={el} />
            )
        });

        /* This is removed until further notice
        <form onSubmit={this.addUserClickEvent}>
            <p>Legg til</p>
            <input value={this.state.newUser} onChange={this.updateUserState}></input>
            <input type="submit"/>
        </form>*/

        return <Container>

          <div className="flex-row space-between">
                <h1>Andres ønskeliste</h1>
                  <Link className="shrink button-navigation smallspace" to="/choosepath">Tilbake</Link>
              </div>
              <hr />

            <h2>Se ønskeliste til</h2>
            <div className="wishlist-selection__added-users-container">
                {users}
            </div>

            <DeleteUserDropTarget delete={this.deleteUser} />
            <AddableUsers addUser={this.addUserLinkClick}/>

            <p>{this.state.feedback}</p>

        </Container>
    }
})

module.exports = DragDropContext(TouchBackend)(OthersWishListSelection);
