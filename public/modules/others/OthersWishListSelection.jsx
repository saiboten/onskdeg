import React from 'react'
import Container from '../../common/container/Container';
import {Link} from 'react-router';
var firebase = require('../../common/firebase/firebase');
var user = require('../../common/User');
var debug = require('debug')('OthersWishListSelection')
var config = require('../../Config');

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

    addUser: function(e) {
        e.preventDefault();

        var wishesRef = firebase.database().ref('userlist');
        var that = this;

        return firebase.database().ref('/userlist').once('value').then(function(snapshot) {
            var users = snapshot.val();
            debug("Users: ", users);

            var userfromdb = users.filter(function(userdb) {
              if(userdb.email === that.state.newUser) {
                return true;
              }
              else {
                return false;
              }
            })[0];

            debug("User from db : ", userfromdb);

            if (userfromdb) {
                if (that.state.users.includes(that.state.newUser)) {
                    that.setState({feedback: "Brukeren finnes fra før"})
                } else if (that.state.newUser == user.getUserEmail()) {
                    that.setState({feedback: "Du har ikke lov å legge til deg selv"});
                } else {
                    var newList = that.state.users.concat([userfromdb]);

                    debug('New list: ', newList);
                    firebase.database().ref('users/' + user.getUserUid()).set({users: newList});
                    setState({
                      newUser: ""
                    })
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
            <div>
                <p>Dette er brukernavn til de forskjellige hvis du lurer på hva du skal legge til:</p>
                <ul>
                    <li>Tobias: saiboten@gmail.com</li>
                    <li>Karina: karinarusaasolsen@gmail.com</li>
                    <li>Synne: synnemarte@gmail.com</li>
                    <li>Agathe: arolsen@live.no</li>
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
