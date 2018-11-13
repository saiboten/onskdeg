// @flow

import React from 'react';
import { any, func } from 'prop-types';
import { connect } from 'react-redux';

import { checkSuggestion, deleteSuggestion } from '../../state/actions/suggestion';

import OtherWish from '../others/OtherWish';
import suggestionsFirebase from './suggestionsFirebase';
import store from '../../store';

const debug = require('debug')('Suggestion');

const counter = 0;

const mapStateToProps = (state, ownProps) => {
  const keys = Object.keys(state.suggestion);
  const theRightKey = keys.filter(userid => (
    userid === ownProps.userUid
  ));

  return {
    suggestion: state.suggestion[theRightKey].filter(suggestion => (
      suggestion.id === ownProps.suggestion.id
    ))[0],
    counter: counter + 1,
    user: state.user,
  };
};

const checkSuggestionThunk = ownProps => (dispatch, getState) => {
  dispatch(checkSuggestion(ownProps.userUid, ownProps.suggestion.id, getState().user.email));
  suggestionsFirebase.saveSuggestions(store.getState().suggestion);
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCheckSuggestion() {
    debug('onCheckSuggestion');
    dispatch(checkSuggestionThunk(ownProps));
  },
  onDeleteSuggestion() {
    debug('onDeleteSuggestion');

    dispatch(deleteSuggestion(ownProps.userUid, ownProps.suggestion.id));
    suggestionsFirebase.saveSuggestions(store.getState().suggestion);
  },
});

class Suggestion extends React.PureComponent {
  render() {
    const { suggestion, onCheckSuggestion, onDeleteSuggestion } = this.props;
    const wishInfo = {
      checked: suggestion.checked,
      name: suggestion.wishSuggestion,
      id: suggestion.id,
      checkedby: suggestion.checkedBy,
    };

    const { user } = this.props;

    return (
      <div className="flex-column">
        <OtherWish
          wishInfo={wishInfo}
          onClick={onCheckSuggestion}
          suggestedBy={suggestion.suggestedBy}
          deleteSuggestion={onDeleteSuggestion}
          canDelete={user.email === suggestion.suggestedBy}
        />
      </div>
    );
  }
}

Suggestion.propTypes = {
  suggestion: any,
  onCheckSuggestion: func,
  onDeleteSuggestion: func,
  user: any,
};

export default connect(mapStateToProps, mapDispatchToProps)(Suggestion);
