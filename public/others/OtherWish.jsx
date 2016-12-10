// @flow

var debug = require('debug')('OtherWish');

import React from 'react';
import store from '../store';
import Linkify from 'react-linkify';

var OtherWish = React.createClass({

    render() {

        let checkedBy = store.getState().allUserReducer.filter(user => {
            return user.email === this.props.wishInfo.checkedby;
        })[0];

        let suggestedBy = store.getState().allUserReducer.filter(user => {
            if (!this.props.suggestedBy)
                return false;
            debug("user.email and suggested by ", user.email, this.props.suggestedBy);
            return user.email === this.props.suggestedBy;
        })[0];
        let suggestedByUser = suggestedBy
            ? (
                <div className="smallspace">Foreslått av {suggestedBy.name}</div>
            )
            : "";

        let item = this.props.wishInfo.checked
            ? (
                <del>{this.props.wishInfo.name}</del>
            )
            : this.props.wishInfo.name;
        let linkifyed = (
            <Linkify className="other-wish__linkify">{item}</Linkify>
        );
        let checkedByElem = this.props.wishInfo.checked
            ? (
                <div className="smallspace">Tatt av + {checkedBy.name}</div>
            )
            : "";
        let checkedText = this.props.wishInfo.checked
            ? "Selg"
            : "Kjøp";

        return (
            <div className="flex-column border">
                <div className="smallspace">{linkifyed}</div>
                <div className="smallspace flex-row space-between">
                    <input className="button" onClick={e => this.props.onClick(this.props.wishInfo.id)} value={checkedText}></input>
                </div>
                {suggestedByUser}
                {checkedByElem}
            </div>
        );
    }
})

export default OtherWish;
