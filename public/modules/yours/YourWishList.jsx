import React from 'react'
import Container from '../../common/container/Container';
import { Link } from 'react-router';
var debug = require('debug')('YourWishList');
var user = require('../../common/User');
var Wish = require('./Wish');
var config = require('../../Config');
var firebase = require('../../common/firebase/firebase');

require('./yourwishlist.css');

export default React.createClass({

  getInitialState: function() {
    return {
      wishes: [],
      newWish: ""
    }
  },

  componentDidMount: function() {
    if(user.getUserUid() == undefined) {
      this.props.router.push('/')
    }
    this.setGunWishCallback();
    debug("componentDidMount");
  },

  setGunWishCallback: function() {
    var that = this;

    var ref = firebase.database().ref('wishes/'+user.getUserUid());
    ref.on('value', function(snapshot) {
      if(snapshot.val() != null ) {
        var list = snapshot.val().wishes;
        debug("data :", list);

        that.setState({
          wishes: list
        });
      }
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

    firebase.database().ref('wishes/' + user.getUserUid()).set({wishes: newWishList});

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
      firebase.database().ref('wishes/' + user.getUserUid()).set({wishes: newWishList});
  },

  delete(deleteId) {
    debug("Delete id: ", deleteId);
      var newWishList = Object.assign([],this.state.wishes);

      var newWishList = newWishList.filter(function(e) {
        return e.id === deleteId ? false : true;
      });

      debug("Wish list after deletion: ", newWishList);

      firebase.database().ref('wishes/' + user.getUserUid()).set({wishes: newWishList});
  },

  render() {

    var wishes = this.state.wishes.map(function(el) {
      debug("Creating wish based on this el: ",el);
      return (<Wish update={this.update} delete={this.delete} wishlist={this.state.wishes} wish={el}></Wish>);
    },this);

    debug("Wishes: ", wishes);

    return <Container>
      <h1>Din ønskeliste</h1>

    <div className="your-wishlist__wishlist">
      {wishes}
    </div>

    <hr />

    <form onSubmit={this.addWish} >
      <div className="your-wishlist_add-wish-wrapper">
        <textarea className="your-wishlist_add-wish-textarea" value={this.state.newWish} onChange={this.updateWishState}></textarea>
        <input type="submit" className="your-wishlist_add-wish-submit button" value="Legg til" />
      </div>
    </form>
    <hr />
    <Link className="button-navigation" to="/choosepath">Tilbake</Link>

    </Container>
  }
})
