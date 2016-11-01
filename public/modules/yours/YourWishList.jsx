import React from 'react'
import Container from '../../common/container/Container';
import { Link } from 'react-router';
var debug = require('debug')('YourWishList');
var Gun = require('gun/gun');
var user = require('../../common/User');
var Wish = require('./Wish');
var config = require('../../Config');

require('./yourwishlist.css');

export default React.createClass({

  gun: undefined,

  getInitialState: function() {
    return {
      wishes: [],
      newWish: "",
      callbacks: 0
    }
  },

  componentDidMount: function() {
    var peers = [config.domain + "/gun"];
    this.gun = Gun(peers);
    this.setGunWishCallback();
  },

  setGunWishCallback: function() {
    var that = this;

    var ref = this.gun.get('wishes/'+user.getUser().toLowerCase());

    ref.on(function(data){
      var list = JSON.parse(data.wishes);
      console.log("Got new wish list data: ", list);
      that.setState({
        wishes: list,
        callbacks: that.state.callbacks+1
      });
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

    this.gun.put({wishes: JSON.stringify(newWishList)}).key('wishes/' + user.getUser().toLowerCase());
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
      this.gun.put({wishes: JSON.stringify(newWishList)}).key('wishes/' + user.getUser().toLowerCase());
  },

  delete(deleteId) {
    debug("Delete id: ", deleteId);
      var newWishList = Object.assign([],this.state.wishes);

      var newWishList = newWishList.filter(function(e) {
        return e.id === deleteId ? false : true;
      });

      debug("Wish list after deletion: ", newWishList);

      this.gun.put({wishes: JSON.stringify(newWishList)}).key('wishes/' + user.getUser().toLowerCase());
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
