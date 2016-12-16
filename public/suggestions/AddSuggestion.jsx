// @flow
import React from 'react';

const debug = require('debug')('AddSuggestion');

class AddSuggestion extends React.Component {

  constructor(props) {
    super();
    debug('constructor');

    this.state = {
      suggestion: '',
      feedback: '',
    };

    this.onClick = this.onClick.bind(this);
    this.changeSuggestion = this.changeSuggestion.bind(this);
  }

  onClick(e /* : Event */) {
    debug('onClick');

    e.preventDefault();
    if (this.state.suggestion) {
      this.props.onClick(this.state.suggestion);
    } else {
      this.setState({
        feedback: 'Forslag kan ikke være tomt',
      });
    }
  }

  changeSuggestion(e /* : Event */) {
    debug('changeSuggestion');

    this.setState({
      suggestion: e.target.value,
    });
  }

  render() {
    const feedback = this.state.feedback ? (<span>{this.state.feedback}</span>) : '';

    return (
      <div>
        <h1>Legg til forslag</h1>
        <div className="flex-column">
          <input className="smallspace shrink" onChange={this.changeSuggestion} placeholder="Legg til forslag her" />
          <div>
            <input
              className="smallspace button grow"
              type="submit" onClick={this.onClick}
              value="Lagre forslag"
            />

          </div>
          {feedback}
        </div>
      </div>
    );
  }
}

AddSuggestion.propTypes = {
  onClick: React.PropTypes.func,
};

module.exports = AddSuggestion;
