import React from 'react'
import Container from '../../common/container/Container';
import {Link} from 'react-router';
var debug = require('debug')('OthersWishList');
var config = require('../../Config');
var firebase = require('../../common/firebase/firebase')
var user = require('../../common/User');
var Comments = require('./Comments');

require('./otherwishlist.css');


export default React.createClass({

    getInitialState() {
        return {wishes: [], hideSelected: false, user: ""}
    },

    componentDidMount() {
        if (user.getUserUid() == undefined) {
            this.props.router.push('/')
        }
        this.updateWishState();

        var that = this;
        firebase.database().ref('userlist').on('value', function(data) {
            var userlist = data.val();
            userlist.forEach(user => {
                debug("User : ", user, that.props.params.name);
                if (user.uid == that.props.params.name) {
                    debug("Found it! ", user);
                    that.setState({user: user.email})
                }
            })
        });
    },

    updateWishState() {

        debug("Wish state update");

        var that = this;

        var wishesRef = firebase.database().ref('wishes/' + this.props.params.name);
        wishesRef.on('value', function(snapshot) {
            debug("Callback from wish list: ", snapshot);
            if (snapshot.val() != null) {
                var list = snapshot.val().wishes;
                debug("data :", list);

                that.setState({wishes: list});
            }
        });
    },

    check(event) {
        debug("Check!", event.target.value);
        var newWishList = this.state.wishes.map(function(e) {
            if (event.target.value === e.id) {
                return {
                    name: e.name,
                    checked: !e.checked,
                    id: e.id,
                    checkedby: user.getUserEmail()
                }
            } else {
                return e;
            }
        });
        firebase.database().ref('wishes/' + this.props.params.name).set({wishes: newWishList});
        this.setState({wishes: newWishList, newWish: ""})
    },

    toggleShowSelected(e) {
      e.preventDefault();
        this.setState({
            hideSelected: !this.state.hideSelected
        })
    },

    render() {

        var wishes = this.state.wishes.filter(function(el) {
            debug("Wish to be filtered: ", el);
            return !el.checked || !this.state.hideSelected;
        }, this).map(function(el) {
            var item = el.checked
                ? (
                    <del>{el.name}</del>
                )
                : el.name;
            return (
                <li className="regular">{item}
                    <input className="other-wishlist__checkbox" onChange={this.check} checked={el.checked} value={el.id} type="checkbox"></input><span>{el.checked ? el.checkedby : ""}</span>
                </li>
            );
        }, this);

        return (
            <Container>

              <div className="flex-row space-between">
                <h1 className="shrink overflow-hidden">Ønskelisten til {this.state.user}</h1>
                <Link className="grow button-navigation smallspace" to="/others">Tilbake</Link>
              </div>
              <hr />

              <ul>
                  {wishes}
              </ul>

              <Comments params={this.props.params}/>
              <div className="flex-row space-between">
                  <a className="other-wishlist__toggle-selected space button" onClick={this.toggleShowSelected}>{this.state.hideSelected
                            ? 'Vis utkrysset'
                            : 'Skjul utkrysset'}</a>
              </div>

            </Container>
      )
    }
})
