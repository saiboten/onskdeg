var React = require('react');
var firebase = require('../../../common/firebase/firebase');
var debug = require('debug')('AddableUser');
require('./addableusers.css');
var user = require('../../../common/User');


var AddableUsers = React.createClass({

  getInitialState() {
    return {
      userlist: [],
      open: false
    }
  },

  userInList(uid, userlist) {
    debug("Userlist: ", uid, userlist);
    if(!userlist) {
      return;
    }

    return userlist.filter(user=> {
      return user.uid === uid;
    }).length == 1;
  },

  componentDidMount() {
    var that = this;
    firebase.database().ref('userlist').on('value', (data) => {
      debug('Data returned: ', data.val());
        var userlist = data.val();

        firebase.database().ref('users/' + user.getUserUid()).on('value', (snapshot) => {



            var addedUsers = snapshot.val() ? snapshot.val().users : undefined;
            var filteredUserList = userlist.filter(dbuser=> {
              if(dbuser.uid === user.getUserUid()) {
                return false;
              }
              else if(that.userInList(dbuser.uid, addedUsers)) {
                return false;
              }
              else {
                return true;
              }
            });

            that.setState({
              userlist: filteredUserList
            });
        });
    });
  },

  addUser(e,userUid) {
    e.preventDefault();
    debug("User added: ", userUid);
    this.props.addUser(userUid);
  },

  clearList() {
    this.setState({
      userlist: []
    })
  },

  toggleOpen() {
    this.setState({
      open: !this.state.open
    })
  },

  render() {

    var addableUsers = this.state.userlist.map(user => {
      return (<a href="#" className="addable-users__list-element border space button" onClick={(e) => { this.addUser(e, user.uid)}}>{user.name}</a>)
    })

    var content = this.state.open ? (<div className="addable-users__list">
      {addableUsers}
    </div>) : "";

    return (
      <div>
        <div className="button addable-users__expand-button smallspace" onClick={this.toggleOpen}>{this.state.open ? "-" : "+"}</div>
        {content}

      </div>
    );
  }
});

module.exports = AddableUsers;
