// @flow

var React = require('react');
var debug = require('debug')('Wish');
var ReactDOM = require('react-dom');


require('./wish.css');

var Wish = React.createClass( {

  componentDidUpdate: function() {
    if(this.refs.input) {
      ReactDOM.findDOMNode(this.refs.input).focus()
    }
  },

  componentWillReceiveProps(nextProps: any) {
    this.setState({
      text: nextProps.wish.name
    })
  },

  getInitialState() {
    return {
      edit: false,
      text: this.props.wish.name,
      confirm: false
    }
  },

  click: function() {
    this.setState({
      edit: true
    });
  },

  focusLost: function() {
    this.setState({
      edit: false
    });
    this.props.update({
      newWish: this.state.text,
      id: this.props.wish.id
    });
  },

  updateText: function(e: Event) {
    if (e.target instanceof HTMLInputElement) {
      this.setState({
        text: e.target.value
      })
    }
  },

  delete: function(e: Event) {
    this.setState({
      confirm: true
    })
  },

  cancel: function(e: Event) {
    this.setState({
      confirm: false
    })
  },

  deleteConfirmed: function(e : Event) {
    this.props.delete(this.props.wish.id);
  },

  render: function() {

    var deleteWish = this.state.confirm ? (<div className="flex-row space-between right"><a className="button" onClick={this.cancel}>Avbryt</a><a className="button wish__confirm-delete-button" onClick={this.deleteConfirmed}>Slett</a></div>) : (<a className="wish__delete-button button" onClick={this.delete}>Slett</a>);

    var html = this.state.edit ?
    (<textarea className="wish__wish-input" ref="input" onBlur={this.focusLost} onChange={this.updateText} value={this.state.text} /> ):
    (<span onClick={this.click} className="wish__wish-text">{this.state.text}</span>);
    return (
      <div className="wish__wish-listelement flex-row space-between">{html} {deleteWish}</div>
    )
  }
});

module.exports = Wish;
