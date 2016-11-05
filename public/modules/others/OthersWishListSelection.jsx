import React from 'react'
import Container from '../../common/container/Container';
import {Link} from 'react-router';
var firebase = require('../../common/firebase/firebase');
var user = require('../../common/User');
var debug = require('debug')('OthersWishListSelection')
var config = require('../../Config');

export default React.createClass({

    getInitialState() {
        return {
          users: [],
          newUser: "",
          feedback: ""
        }
    },

    componentDidMount() {
      debug('this.state.users',this.state.users);
        this.getUsers();
    },

    getUsers: function() {
      var that = this;

      var ref = firebase.database().ref('users/' + user.getUser().toLowerCase());
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

      if(this.state.users.includes(this.state.newUser)) {
        this.setState({
          feedback: "Brukeren finnes fra før"
        })
      }
      else if(this.state.newUser == user.getUser()) {
          this.setState({
              feedback: "Du har ikke lov å legge til deg selv"
          });
      }
      else {
        var newList = this.state.users.concat([this.state.newUser]);

        debug('New list: ', newList);
        firebase.database().ref('users/' + user.getUser().toLowerCase()).set({users: newList});
        this.setState({users: this.state.users.concat([this.state.newUser]), newUser: ""});
      }
    },

    render() {

        var users = this.state.users.map(el => {
            return (
                <li>
                    <Link to={"/other/" + el}>{el}</Link>
                </li>
            )
        });

        return <Container><h1>Andres ønskeliste</h1>
            <div><p>Dette er brukernavn til de forskjellige hvis du lurer på hva du skal legge til:</p>
              <ul>
                <li>Tobias: saiboten</li>
                <li>Karina: karinarusaasolsen</li>
                <li>Synne: synnemarte</li>
                <li>Agathe: arolsen</li>
              </ul>

            </div>
            <h2>Velg bruker</h2>
            <ul>
                {users}
            </ul>

            <form onSubmit={this.addUser}>
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
