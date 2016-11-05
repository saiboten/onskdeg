var React = require('react');
var firebase = require('../../common/firebase/firebase');
var debug = require('debug')('AddableUser');

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

  addUser(userUid) {
    debug("User added: ", userUid);
    this.props.addUser(userUid);
  },

  render() {

    var addableUsers = this.state.userlist.map(user => {
      debug("Addable user: ", user);
      return (<li><a onClick={function() { this.addUser(user.uid)}.bind(this)}>{user.email}</a></li>)
    })

    return (
      <div>
        <h2>Legg til eksisterende brukere</h2>
      <ul>
        {addableUsers}
      </ul>
      </div>
    );
  }
});

module.exports = AddableUsers;
