import React from 'react'
import Container from '../common/container/Container';
import { Link } from 'react-router';
var debug = require('debug')('YourWishList');
var user = require('../common/User');
var Wish = require('../wish/Wish');
var firebase = require('../firebase/firebase');
import store from '../store';
import { connect } from 'react-redux'

require('./yourwishlist.css');

const mapStateToProps = function(state, ownProps) {
  debug("User wishes", state.wishReducer[user.getUserUid()]);
  return {
    wishes: state.wishReducer[user.getUserUid()] ? state.wishReducer[user.getUserUid()].wishes : []
  }
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    //addWish: dispatch.
  }
};

var YourWishList = React.createClass({

  getInitialState: function() {
    return {
      newWish: "",
      feedback: ""
    }
  },

  componentDidMount: function() {
    if(user.getUserUid() == undefined) {
      this.props.router.push('/')
    }
    debug("componentDidMount");
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

    if(this.state.newWish === "") {
      this.setState({
        feedback: "Ønsket kan ikke være tomt"
      })
      return;
    }

    debug("Adding wish");
    var newWishList = Object.assign([],this.props.wishes);
      newWishList.push({
        name: this.state.newWish,
        checked: false,
        id: this.createGuid()
      });

    firebase.database().ref('wishes/' + user.getUserUid()).set({wishes: newWishList});

    this.setState({
      newWish: "",
      feedback: ""
    })
  },

  update(wish) {
      debug("Saving wishlist: ", wish);
      var newWishList = this.props.wishes.map(function(e) {
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
      var newWishList = Object.assign([],this.props.wishes);

      var newWishList = newWishList.filter(function(e) {
        debug(e.id);
        return e.id === deleteId ? false : true;
      });

      debug("Wish list after deletion: ", newWishList);

      firebase.database().ref('wishes/' + user.getUserUid()).set({wishes: newWishList});
  },

  render() {
    debug("This.props. ", this.props);
    var wishes = this.props.wishes.map(function(el) {
      debug("Creating wish based on this el: ",el);
      return (<Wish update={this.update} delete={this.delete} wishlist={this.props.wishes} wish={el}></Wish>);
    },this);

    debug("Wishes: ", wishes);

    return <Container>

      <div className="flex-row space-between">
          <h1>Din ønskeliste</h1>
            <Link className="shrink button-navigation smallspace" to="/choosepath">Tilbake</Link>
      </div>
      <hr />

    <div className="your-wishlist__wishlist">
      {wishes}
    </div>

    <hr />

    <form onSubmit={this.addWish} >
      <div className="your-wishlist_add-wish-wrapper">
        <textarea placeholder="Legg inn nye ønsker her" className="your-wishlist_add-wish-textarea" value={this.state.newWish} onChange={this.updateWishState}></textarea>
        <input type="submit" className="your-wishlist_add-wish-submit button" value="Legg til" />
        <div>{this.state.feedback}</div>
      </div>
    </form>

    </Container>
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps)
  (YourWishList);
