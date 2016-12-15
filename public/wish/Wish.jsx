// @flow

import React from 'react';
import ReactDOM from 'react-dom';

const debug = require('debug')('Wish');

require('./wish.css');

class Wish extends React.Component {

  getInitialState() {
    return {
      edit: false,
      text: this.props.wish.name,
      confirm: false,
    };
  }

  componentWillReceiveProps(nextProps /* : any */) {
    this.setState({
      text: nextProps.wish.name,
    });
  }

  componentDidUpdate() {
    if (this.input) {
      this.input.focus();
    }
  }


  click() {
    this.setState({
      edit: true,
    });
  }

  focusLost() {
    this.setState({
      edit: false,
    });
    this.props.update({
      newWish: this.state.text,
      id: this.props.wish.id,
    });
  }

  updateText(e /* : Event */) {
    this.setState({
      text: e.target.value,
    });
  }

  delete(e /* : Event */) {
    this.setState({
      confirm: true,
    });
  }

  cancel(e /* : Event */) {
    this.setState({
      confirm: false,
    });
  }

  deleteConfirmed(e /* : Event */) {
    this.props.delete(this.props.wish.id);
  }

  render() {
    const deleteWish = this.state.confirm ?
    (
      <div className="flex-row space-between right">
        <button className="button" onClick={this.cancel}>Avbryt</button>
        <button className="button wish__confirm-delete-button" onClick={this.deleteConfirmed}>Slett</button>
      </div>) : (<button className="wish__delete-button button" onClick={this.delete}>Slett</button>);

    const html = this.state.edit ?
    (<textarea
      className="wish__wish-input"
      ref={(c) => { this.input = c; }}
      onBlur={this.focusLost}
      onChange={this.updateText}
      value={this.state.text}
    />
    ) :
    (<button onClick={this.click} className="wish__wish-text">{this.state.text}</button>);
    return (
      <div className="wish__wish-listelement flex-row space-between">{html} {deleteWish}</div>
    );
  }
}

Wish.propTypes = {
  delete: React.PropTypes.func,
  wish: React.PropTypes.object,
  update: React.PropTypes.func,
};

module.exports = Wish;
