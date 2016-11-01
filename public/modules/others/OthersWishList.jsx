import React from 'react'
import Container from '../../common/container/Container';
import { Link } from 'react-router';
var debug = require('debug')('OthersWishList');
var config = require('../../Config');


export default React.createClass({

  getInitialState() {
    return {
      wishes: []
    }
  },

  componentDidMount() {
    var peers = [config.domain + "/gun"];
    this.gun = Gun(peers);

    this.updateWishState();

  },

  updateWishState() {
    var that = this;
    this.gun.get('wishes/'+this.props.params.name.toLowerCase(), function(error,data) {
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
    this.gun.put({wishes: JSON.stringify(newWishList)}).key('wishes/'+this.props.params.name.toLowerCase());
    this.setState({
      wishes: newWishList,
      newWish: ""
    })
  },

  render() {



    var wishes = this.state.wishes.map(function(el) {
      var item = el.checked ? (<del>{el.name}</del>) : el.name;
      return (<li>{item}<input onChange={this.check} checked={el.checked} value={el.id} type="checkbox"></input></li>);
    },this);

    return <Container>Ønskelisten til {this.props.params.name}
    <ul>
      {wishes}
    </ul>

    <li><Link to="/">Tilbake</Link></li>
    </Container>
  }
})
