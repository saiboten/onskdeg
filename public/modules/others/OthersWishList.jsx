import React from 'react'
import Container from '../../common/container/Container';
import { Link } from 'react-router';
var debug = require('debug')('OthersWishList');
var config = require('../../Config');
var gun = require('../../common/gun/gun')

export default React.createClass({

  getInitialState() {
    return {
      wishes: [],
      hideSelected: false
    }
  },

  componentDidMount() {
    this.updateWishState();

  },

  updateWishState() {

    debug("Wish state update");

    var that = this;
    gun.get('wishes/'+this.props.params.name.toLowerCase(), function(error,data) {
      debug("GUN data: ", error, data);

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

  check(event) {
    debug("Check!", event.target.value);
    var newWishList = this.state.wishes.map(function(e) {
        if(event.target.value === e.id) {
          return {
            name: e.name,
            checked: !e.checked,
            id: e.id
          }
        }
        else {
          return e;
        }
    });
    gun.put({wishes: JSON.stringify(newWishList)}).key('wishes/'+this.props.params.name.toLowerCase());
    this.setState({
      wishes: newWishList,
      newWish: ""
    })
  },

  toggleShowSelected() {
    this.setState({
      hideSelected: !this.state.hideSelected
    })
  },

  render() {
    var wishes = this.state.wishes.filter(function(el) {
      debug("EL: ", el);
      return !el.checked || !this.state.hideSelected;
    },this).map(function(el) {
      var item = el.checked ? (<del>{el.name}</del>) : el.name;
      return (<li>{item}<input onChange={this.check} checked={el.checked} value={el.id} type="checkbox"></input></li>);
    },this);

    return <Container>Ønskelisten til {this.props.params.name}
    <ul>
      {wishes}
    </ul>

    <button onClick={this.toggleShowSelected}>{this.state.hideSelected ? 'Vis utkrysset': 'Skjul utkrysset'}</button>


    <li><Link to="/">Tilbake</Link></li>
    </Container>
  }
})
