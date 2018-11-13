// @flow
import React from 'react';
import { func } from 'prop-types';

const debug = require('debug')('AddSuggestion');

class AddSuggestion extends React.Component {
  constructor(props) {
    super(props);
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
    const { suggestion } = this.state;
    const { onClick } = this.props;

    e.preventDefault();
    if (suggestion) {
      onClick(suggestion);
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
    const { feedback: feedbackFromState } = this.state;
    const feedback = feedbackFromState ? (<span>{feedbackFromState}</span>) : '';

    return (
      <div>
        <h1>Legg til forslag</h1>
        <div className="flex-column">
          <input className="smallspace shrink" onChange={this.changeSuggestion} placeholder="Legg til forslag her" />
          <div>
            <input
              className="smallspace button button--padded grow"
              type="submit"
              onClick={this.onClick}
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
  onClick: func.isRequired,
};

export default AddSuggestion;
