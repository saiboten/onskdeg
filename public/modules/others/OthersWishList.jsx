import React from 'react'
import Container from '../../common/container/Container';
import {Link} from 'react-router';
var debug = require('debug')('OthersWishList');
var firebase = require('../../common/firebase/firebase')
var user = require('../../common/User');
var Comments = require('./Comments');
import { connect } from 'react-redux'
import Suggestions from './suggestion/Suggestions';
import OtherWish from './OtherWish';

require('./otherwishlist.css');

const mapStateToProps = function(state, ownProps) {
  debug("mapDispatchToProps: ", state, ownProps);
  return {
    userlist: state.allUserReducer
  }
};

const mapDispatchToProps = (dispatch, ownProps) => (
  {}
)

var OthersWishList = React.createClass({

    getInitialState() {
        return {wishes: [], hideSelected: false, user: ""}
    },

    componentDidMount() {
        if (user.getUserUid() == undefined) {
            this.props.router.push('/')
        }
        this.updateWishState();

        var userlist = this.props.userlist;
        userlist.forEach(user => {
            if (user.uid == this.props.params.name) {
                debug("Found it! ", user);
                this.setState({user: user.name})
            }
        })
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

    check(id) {
        debug("Check!", id);
        var newWishList = this.state.wishes.map(function(e) {
            if (id === e.id) {
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
        }, this).map(function(wishInfo) {
            return (<OtherWish onClick={this.check} wishInfo={wishInfo} />);
        },this);

        return (
            <Container>

              <div className="flex-row space-between">
                <h1 className="shrink overflow-hidden">Ønskelisten til {this.state.user}</h1>
                <Link className="grow button-navigation smallspace" to="/others">Tilbake</Link>
              </div>
              <hr />

              <h2>Dette ønsker {this.state.user} seg</h2>

              <ul>
                  {wishes}
              </ul>

              <Suggestions username={this.state.user} userUid={this.props.params.name} />
              <hr />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OthersWishList)
