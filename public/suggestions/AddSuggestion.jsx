// @flow
let debug = require('debug')('AddSuggestion');

import React from 'react';

let AddSuggestion = React.createClass({

  getInitialState() {
    debug('getInitialState');

    return {
      suggestion: "",
      feedback: ""
    }
  },

  changeSuggestion(e: Event) {
    debug('changeSuggestion');

    this.setState({
      suggestion: e.target.value
    });

  },

  onClick(e: Event) {
    debug('onClick');

    e.preventDefault();
    if(this.state.suggestion) {
      this.props.onClick(this.state.suggestion);
    }
    else {
      this.setState( {
        feedback: "Forslag kan ikke være tomt"
      })
    }
  },

  render() {

    let feedback = this.state.feedback ? (<span>{this.state.feedback}</span>) : "";

    return(
      <div>
        <h1>Legg til forslag</h1>
        <div className="flex-column">
          <input className="smallspace shrink" onChange={this.changeSuggestion} placeholder="Legg til forslag her" />
          <div><input className="smallspace button grow" type="submit" onClick={this.onClick} value="Lagre forslag"></input></div>
          {feedback}
        </div>
      </div>
    );
  }
});

module.exports = AddSuggestion;
