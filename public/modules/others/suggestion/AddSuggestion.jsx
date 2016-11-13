import React from 'react';

var AddSuggestion = React.createClass({

  getInitialState() {
    return {
      suggestion: "",
      feedback: ""
    }
  },

  changeSuggestion(e) {
    this.setState({
      suggestion: e.target.value
    })
  },

  onClick(e) {
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

    var feedback = this.state.feedback ? (<span>{this.state.feedback}</span>) : "";

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
