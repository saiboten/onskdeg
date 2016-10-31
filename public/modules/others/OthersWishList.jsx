import React from 'react'
import Container from '../../common/container/Container';
import { Link } from 'react-router';

export default React.createClass({

  getInitialState() {
    return {
      wishes: []
    }
  },

  componentDidMount() {
    var peers = ["http://spotocracy.net/gun"];
    this.gun = Gun(peers);
    var that = this;

    this.gun.get('wishes/'+this.props.params.name.toLowerCase(), function(error,data) {
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

  render() {

    var wishes = this.state.wishes.map(function(el) {
      return (<li>{el}</li>);
    });

    return <Container>Ønskelisten til {this.props.params.name}
    <ul>
      {wishes}
    </ul>

    <li><Link to="/">Tilbake</Link></li>
    </Container>
  }
})
