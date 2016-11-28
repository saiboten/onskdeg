import React from 'react';
var debug = require('debug')('OtherWish');
var store = require('../store');
var Linkify = require('react-linkify').default;

var OtherWish = React.createClass({

  render() {

    var checkedBy = store.getState().allUserReducer.filter(user=>{
      return user.email === this.props.wishInfo.checkedby;
    })[0];

    var suggestedBy = store.getState().allUserReducer.filter(user=>{
      if(!this.props.suggestedBy) return false;
      debug("user.email and suggested by ", user.email, this.props.suggestedBy);
      return user.email === this.props.suggestedBy;
    })[0];
    var suggestedByUser = suggestedBy ? (<div className="smallspace">Foreslått av {suggestedBy.name}</div>) : "";

    var item = this.props.wishInfo.checked ? (<del>{this.props.wishInfo.name}</del>) : this.props.wishInfo.name;
    var linkifyed = (<Linkify>{item}</Linkify>);
    var checkedBy = this.props.wishInfo.checked ? (<div className="smallspace">'Tatt av ' + {checkedBy.name}</div>) : "";
    var checkedText = this.props.wishInfo.checked ? "Selg":"Kjøp";

    debug("Linkyfied: ", linkifyed);

    return (
        <div className="flex-column border">
          <div className="smallspace" >{linkifyed}</div>
          <div className="smallspace flex-row space-between"><input className="button" onClick={e => this.props.onClick(this.props.wishInfo.id)} value={checkedText}></input>
          </div>
          {suggestedByUser}
          {checkedBy}
        </div>
    );
  }
})

export default OtherWish;
