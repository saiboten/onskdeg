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

  componentWillReceiveProps(nextProps) {
    debug("nextProps", nextProps);
    this.setState({
      text: nextProps.wish.name
    })
  },

  getInitialState() {
    return {
      edit: false,
      text: this.props.wish.name
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

  updateText: function(e) {
    this.setState({
      text: e.target.value
    })
  },

  delete: function(e) {
    this.props.delete(this.props.wish.id);
  },

  render: function() {
    var html = this.state.edit ? <input ref="input" onBlur={this.focusLost} onChange={this.updateText} value={this.state.text} /> : <span onClick={this.click}>{this.state.text}</span>;
    return (
      <li>{html} <button className="wish__delete-button" onClick={this.delete}>Slett</button></li>
    )
  }
});

module.exports = Wish;
