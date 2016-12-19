// @flow

import React from 'react';
import { connect } from 'react-redux';

import { checkSuggestion, deleteSuggestion } from './suggestionActions';

import OtherWish from '../others/OtherWish';
import user from '../common/User';
import suggestionsFirebase from './suggestionsFirebase';
import store from '../store';

const debug = require('debug')('Suggestion');

const counter = 0;

const mapStateToProps = (state, ownProps) => {
  const keys = Object.keys(state.suggestionReducer);
  const theRightKey = keys.filter(userid => (
    userid === ownProps.userUid
  ));

  return {
    suggestion: state.suggestionReducer[theRightKey].filter(suggestion => (
      suggestion.id === ownProps.suggestion.id
    ))[0],
    counter: counter + 1,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    onCheckSuggestion() {
      debug('onCheckSuggestion');

      dispatch(checkSuggestion(ownProps.userUid, ownProps.suggestion.id, user.getUserEmail()));
      suggestionsFirebase.saveSuggestions(store.getState().suggestionReducer);
    },
    onDeleteSuggestion() {
      debug('onDeleteSuggestion');

      dispatch(deleteSuggestion(ownProps.userUid, ownProps.suggestion.id));
      suggestionsFirebase.saveSuggestions(store.getState().suggestionReducer);
    },
  };
};

class Suggestion extends React.PureComponent {
  render() {
    const wishInfo = {
      checked: this.props.suggestion.checked,
      name: this.props.suggestion.wishSuggestion,
      id: this.props.suggestion.id,
      checkedby: this.props.suggestion.checkedBy,
    };

    return (
      <div className="flex-column">
        <OtherWish
          wishInfo={wishInfo}
          onClick={this.props.onCheckSuggestion}
          suggestedBy={this.props.suggestion.suggestedBy}
          deleteSuggestion={this.props.onDeleteSuggestion}
          canDelete={user.getUserEmail() === this.props.suggestion.suggestedBy}
        />
      </div>
    );
  }
}

Suggestion.propTypes = {
  suggestion: React.PropTypes.object,
  onCheckSuggestion: React.PropTypes.func,
  onDeleteSuggestion: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Suggestion);
