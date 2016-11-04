import React from 'react'
import Container from '../../common/container/Container';
import { Link } from 'react-router';
var debug = require('debug')('YourWishList');
var user = require('../../common/User');
var Wish = require('./Wish');
var config = require('../../Config');
var firebase = require('../../common/gun/gun');

require('./yourwishlist.css');

export default React.createClass({

  getInitialState: function() {
    return {
      wishes: [],
      newWish: "",
      callbacks: 0
    }
  },

  componentDidMount: function() {
    this.setGunWishCallback();
    debug("componentDidMount");
  },

  setGunWishCallback: function() {
    var that = this;

    var ref = firebase.database().ref('wishes/'+user.getUser().toLowerCase());
    ref.on('value', function(snapshot) {
      debug("snapshot data :", snapshot);

      /*that.setState({
        wishes: list,
        callbacks: that.state.callbacks+1
      });*/
    });
  },

  createGuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
    });
  },

  updateWishState: function(e) {
    this.setState({
      newWish: e.target.value
    })
  },

  addWish: function(e) {
    e.preventDefault();

    debug("Adding wish");
    var newWishList = Object.assign([],this.state.wishes);
      newWishList.push({
        name: this.state.newWish,
        checked: false,
        id: this.createGuid()
      });

    firebase.database().ref('wishes/' + user.getUser().toLowerCase()).set({wishes: JSON.stringify(newWishList)});

    this.setState({
      newWish: ""
    })
  },

  update(wish) {
      debug("Saving wishlist: ", wish);
      var newWishList = this.state.wishes.map(function(e) {
          if(e.id === wish.id) {
            return {
              name: wish.newWish,
              checked: e.checked,
              id: e.id
            }
          }
          else {
            return e;
          }
      });
      firebase.database().ref('wishes/' + user.getUser().toLowerCase()).set({wishes: JSON.stringify(newWishList)});
  },

  delete(deleteId) {
    debug("Delete id: ", deleteId);
      var newWishList = Object.assign([],this.state.wishes);

      var newWishList = newWishList.filter(function(e) {
        return e.id === deleteId ? false : true;
      });

      debug("Wish list after deletion: ", newWishList);

      firebase.database().ref('wishes/' + user.getUser().toLowerCase()).set({wishes: JSON.stringify(newWishList)});
  },

  render() {

    var wishes = this.state.wishes.map(function(el) {
      debug("Creating wish based on this el: ",el);
      return (<Wish update={this.update} delete={this.delete} wishlist={this.state.wishes} wish={el}></Wish>);
    },this);

    debug("Wishes: ", wishes);

    return <Container>Din ønskeliste

    <ul className="your-wishlist__wishlist">
      {wishes}
    </ul>

    <form onSubmit={this.addWish} >
      <input value={this.state.newWish} onChange={this.updateWishState}></input>
      <input type="submit" value="Legg til" />
    </form>
    <p>Callbacks: {this.state.callbacks}</p>
    <li><Link to="/">Tilbake</Link></li>

    </Container>
  }
})
