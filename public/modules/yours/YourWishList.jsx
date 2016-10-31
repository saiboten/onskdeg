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
      newWish: ""
    }
  },

  componentDidMount: function() {
    var peers = [config.domain + "/gun"];
    this.gun = Gun(peers);
    this.fillWishList();
  },

  fillWishList: function() {
    var that = this;

    this.gun.get('wishes/'+user.getUser().toLowerCase(), function(error,data) {
      console.log("GUN data: ", error, data);

      if(error) {
        debug('Error: ', error);
      }
      else if(data) {
        var list = JSON.parse(data.wishes);
        console.log("Data retrieved: ", list);
        that.setState({
          wishes: list
        })
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
    var newWishList = this.state.wishes;
      newWishList.push({
        name: this.state.newWish,
        checked: false,
        id: this.createGuid()
      });

    this.gun.put({wishes: JSON.stringify(newWishList)}).key('wishes/' + user.getUser().toLowerCase());

    this.setState({
      wishes: newWishList,
      newWish: ""
    })
  },

  save(wish) {
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
      this.setState({
        wishes: newWishList,
        newWish: ""
      })
  },

  delete(deleteId) {
      var newWishList = this.state.wishes.filter(function(e) {
        return e.id === deleteId ? false : true;
      });
      this.gun.put({wishes: JSON.stringify(newWishList)}).key('wishes/' + user.getUser().toLowerCase());
      this.setState({
        wishes: newWishList,
        newWish: ""
      })
  },

  render() {

    var wishes = this.state.wishes.map(function(el) {
      return (<Wish save={this.save} delete={this.delete} wishlist={this.state.wishes} id={el.id}>{el.name}</Wish>);
    },this);

    return <Container>Din ønskeliste

    <ul className="your-wishlist__wishlist">
      {wishes}
    </ul>

    <form onSubmit={this.addWish} >
      <input value={this.state.newWish} onChange={this.updateWishState}></input>
      <input type="submit" value="Legg til" />
    </form>

    <li><Link to="/">Tilbake</Link></li>

    </Container>
  }
})
