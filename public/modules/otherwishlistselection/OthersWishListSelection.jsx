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
import store from '../../store';

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

    getUsers() {
        var that = this;

        var ref = firebase.database().ref('users/' + user.getUserUid());
        ref.on('value', (snapshot) => {
            if (snapshot.val() != null) {
                var list = snapshot.val().users;
                debug("data :", list);

                that.setState({users: list})
            }
        });
    },

    updateUserState(e) {
        this.setState({newUser: e.target.value})
    },

    addUserLinkClick(uid) {
      debug('Store.getState.allUserReducer:', store.getState().allUserReducer);
      var userfromdb = store.getState().allUserReducer.filter((userdb) => {
          return userdb.uid === uid;
      })[0];
      this.addUser(userfromdb.email);
    },

    addUserClickEvent(e) {
      e.preventDefault();
      this.addUser(this.state.newUser);
    },

    addUser(newUserMail) {
        debug("Adding user: ", newUserMail);

        var users = store.getState().allUserReducer;
        debug("Users: ", users);

        var userfromdb = users.filter((userdb) => {
            if (userdb.email === newUserMail) {
                return true;
            } else {
                return false;
            }
        })[0];

        debug("User from db : ", userfromdb);

        if (userfromdb) {
            if (this.state.users.filter(user => { return user.email === newUserMail }).length === 1) {
                this.setState({feedback: "Brukeren er lagt til fra før"})
            } else if (newUserMail == user.getUserEmail()) {
                this.setState({feedback: "Du har ikke lov å legge til deg selv"});
            } else {
                var newList = this.state.users.concat([userfromdb]);

                debug('New list: ', newList);
                firebase.database().ref('users/' + user.getUserUid()).set({users: newList});
                this.setState({newUser: ""})
            }
        } else {
            this.setState({feedback: "Denne brukeren finnes ikke"});
        }
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
