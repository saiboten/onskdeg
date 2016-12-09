let debug = require('debug')('OthersWishList');

import React from 'react'
import Container from '../common/container/Container';
import {Link} from 'react-router';
import firebase from '../firebase/firebase';
import user from '../common/User';
import Comments from './Comments';
import {connect} from 'react-redux'
import Suggestions from '../suggestions/Suggestions';
import OtherWish from './OtherWish';

require('./otherwishlist.css');

const mapStateToProps = (state, ownProps) => {
    debug("mapDispatchToProps: ", state, ownProps);
    return {userlist: state.allUserReducer}
};

const mapDispatchToProps = (dispatch, ownProps) => ({})

let OthersWishList = React.createClass({

    getInitialState() {
        debug("getInitialState");
        return {wishes: [], hideSelected: true, user: "", feedback: ""}
    },

    componentDidMount() {
        debug("componentDidMount");

        this.updateWishState();

        let userlist = this.props.userlist;
        userlist.forEach(user => {
            if (user.uid == this.props.params.name) {
                debug("Found it! ", user);
                this.setState({user: user.name})
            }
        })
    },

    updateWishState() {
        debug("updateWishState");

        let wishesRef = firebase.database().ref('wishes/' + this.props.params.name);
        wishesRef.on('value', snapshot => {
            debug("Callback from wish list: ", snapshot);
            if (snapshot.val() != null) {
                var list = snapshot.val().wishes;
                debug("data :", list);

                this.setState({wishes: list});
            }
        });
    },

    check(id) {
        debug("check", id);
        let newWishList = this.state.wishes.map((e) => {
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
        this.setState({wishes: newWishList, newWish: "", feedback: "Du kjøpte eller solgte noe!"})
    },

    toggleShowSelected(e) {
        debug("toggleShowSelected", e);
        e.preventDefault();
        this.setState({
            hideSelected: !this.state.hideSelected
        })
    },

    render() {

        let wishes = this.state.wishes.filter(el => {
            debug("Wish to be filtered: ", el);
            return !el.checked || !this.state.hideSelected;
        }, this).map(wishInfo => {
            return (<OtherWish onClick={this.check} wishInfo={wishInfo}/>);
        }, this);

        return (
            <Container>

                <div className="flex-row space-between">
                    <h1 className="shrink overflow-hidden">Ønskelisten til {this.state.user}</h1>
                    <Link className="grow button-navigation smallspace" to="/others">Tilbake</Link>
                </div>
                <hr/>

                <h2>Dette ønsker {this.state.user} seg</h2>
                <p>{this.state.feedback}</p>
                <ul>
                    {wishes}
                </ul>

                <Suggestions username={this.state.user} userUid={this.props.params.name}/>
                <hr/>
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

export default connect(mapStateToProps, mapDispatchToProps)(OthersWishList)
