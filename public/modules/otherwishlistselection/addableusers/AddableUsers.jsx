var React = require('react');
var firebase = require('../../../common/firebase/firebase');
var debug = require('debug')('AddableUser');
require('./addableusers.css');

var AddableUsers = React.createClass({

  getInitialState() {
    return {
      userlist: []
    }
  },

  componentDidMount() {
    var that = this;
    firebase.database().ref('userlist').on('value', function(data) {
      debug('Data returned: ', data);
        var userlist = data.val();
        that.setState({
          userlist: userlist
        });
    });
  },

  addUser(e,userUid) {
    e.preventDefault();
    debug("User added: ", userUid);
    this.props.addUser(userUid);
  },

  render() {

    var addableUsers = this.state.userlist.map(user => {
      return (<a href="#" className="addable-users__list-element button" onClick={function(e) { this.addUser(e, user.uid)}.bind(this)}>{user.email}</a>)
    })

    return (
      <div>
        <h2>Legg til eksisterende brukere</h2>
      <div className="addable-users__list">
        {addableUsers}
      </div>
      </div>
    );
  }
});

module.exports = AddableUsers;
