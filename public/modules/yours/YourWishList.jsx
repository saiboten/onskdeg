import React from 'react'
import Container from '../../common/container/Container';
import { Link } from 'react-router';
var debug = require('debug')('YourWishList');
var Gun = require('gun/gun');
var user = require('../../common/User');
var Wish = require('./Wish');

export default React.createClass({

  gun: undefined,

  getInitialState: function() {
    return {
      wishes: [],
      newWish: ""
    }
  },

  componentDidMount: function() {
    var peers = ["http://spotocracy.net/gun"];
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

  updateWishState: function(e) {
    this.setState({
      newWish: e.target.value
    })
  },

  addWish: function(e) {
    e.preventDefault();

    debug("Adding wish");
    var newWishList = this.state.wishes;
      newWishList.push(this.state.newWish);

    this.gun.put({wishes: JSON.stringify(newWishList)}).key('wishes/' + user.getUser().toLowerCase());

    this.setState({
      wishes: newWishList,
      newWish: ""
    })
  },

  save(wish) {
      debug("Saving wishlist: ", wish);
      var newWishList = this.state.wishes.map(function(e) {
          return e === wish.oldWish ? wish.newWish : e;
      });
      this.gun.put({wishes: JSON.stringify(newWishList)}).key('wishes/' + user.getUser().toLowerCase());
      this.setState({
        wishes: newWishList,
        newWish: ""
      })
  },

  delete(toBeDeleted) {
      var newWishList = this.state.wishes.filter(function(e) {
        return e === toBeDeleted ? false : true;
      });
      this.gun.put({wishes: JSON.stringify(newWishList)}).key('wishes/' + user.getUser().toLowerCase());
      this.setState({
        wishes: newWishList,
        newWish: ""
      })
  },

  render() {

    var wishes = this.state.wishes.map(function(el) {
      return (<Wish save={this.save} delete={this.delete} wishlist={this.state.wishes}>{el}</Wish>);
    },this);

    return <Container>Din ønskeliste

    <ul>
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
