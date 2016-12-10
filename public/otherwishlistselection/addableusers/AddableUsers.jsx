// @flow
let debug = require('debug')('AddableUser');

import React from 'react';
import firebase from '../../firebase/firebase';
import user from '../../common/User';

require('./addableusers.css');

let AddableUsers = React.createClass({

    getInitialState() {
        debug("getInitialState");
        return {userlist: [], open: false}
    },

    userInList(uid: String, userlist: Array<Object>) {
        debug("userInList: ", uid, userlist);
        if (!userlist) {
            return;
        }

        return userlist.filter(user => {
            return user.uid === uid;
        }).length == 1;
    },

    componentDidMount() {
        debug("componentDidMount");

        firebase.database().ref('userlist').on('value', (data) => {
            debug('Data returned: ', data.val());
            var userlist = data.val();

            firebase.database().ref('users/' + user.getUserUid()).on('value', (snapshot) => {

                var addedUsers = snapshot.val()
                    ? snapshot.val().users
                    : undefined;
                var filteredUserList = userlist.filter(dbuser => {
                    if (dbuser.uid === user.getUserUid()) {
                        return false;
                    } else if (this.userInList(dbuser.uid, addedUsers)) {
                        return false;
                    } else {
                        return true;
                    }
                });

                this.setState({userlist: filteredUserList});
            });
        });
    },

    addUser(e: Event, userUid: String) {
        debug("addUser", e, userUid);
        e.preventDefault();
        this.props.addUser(userUid);
    },

    clearList() {
        debug("clearList");

        this.setState({userlist: []})
    },

    toggleOpen() {
        debug("toggleOpen");

        this.setState({
            open: !this.state.open
        })
    },

    render() {

        var addableUsers = this.state.userlist.map(user => {
            return (
                <a href="#" className="addable-users__list-element border space button" onClick={(e) => {
                    this.addUser(e, user.uid)
                }}>{user.name}</a>
            )
        })

        var content = this.state.open
            ? (
                <div className="addable-users__list">
                    {addableUsers}
                </div>
            )
            : "";

        return (
            <div>
                <div className="button addable-users__expand-button smallspace" onClick={this.toggleOpen}>{this.state.open
                        ? "-"
                        : "+"}</div>
                {content}

            </div>
        );
    }
});

module.exports = AddableUsers;
