import React from 'react';
var debug = require('debug')('OtherWish');
var store = require('../store');

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
    var suggestedByUser = suggestedBy ? (<div>Foreslått av {suggestedBy.name}</div>) : "";



    var item = this.props.wishInfo.checked ? (<del>{this.props.wishInfo.name}</del>) : this.props.wishInfo.name;

    return (
        <div onClick={e => this.props.onClick(this.props.wishInfo.id)} className="flex-column border">
          <div className="smallspace">{item} </div>
          <div className="smallspace">{suggestedByUser} </div>
          <div className="smallspace">{this.props.wishInfo.checked ? 'Tatt av ' + checkedBy.name : ""}</div>
        </div>
    );
  }
})

export default OtherWish;
