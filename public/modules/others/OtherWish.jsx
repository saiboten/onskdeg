import React from 'react';
var debug = require('debug')('OtherWish');

var OtherWish = React.createClass({

  render() {
    debug("OtherWish props: ", this.props);

    var item = this.props.wishInfo.checked
        ? (
            <del>{this.props.wishInfo.name}</del>
        )
        : this.props.wishInfo.name;
    return (
        <div onClick={e => this.props.onClick(this.props.wishInfo.id)} className="flex-column border">
          <div className="smallspace">{item}</div>
          <div className="smallspace">{this.props.wishInfo.checked ? 'Tatt av ' + this.props.wishInfo.checkedby : ""}</div>
        </div>
    );
  }
})

export default OtherWish;
