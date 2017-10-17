// @flow

import React from 'react';
import { array, func, string } from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import AddSuggestion from './AddSuggestion';
import { addSuggestion } from './suggestionActions';
import user from '../common/User';
import Suggestion from './Suggestion';
import suggestionsFirebase from './suggestionsFirebase';
import store from '../store';
import Container from '../common/container/Container';

const debug = require('debug')('Suggestions');

const what = 0; // This is used to force rerender from the mapstatetoprops function.

const mapStateToProps = function (state, ownProps) {
  debug('mapStateToProps: ', state, ownProps);

  const key = Object.keys(state.suggestionReducer).filter(suggestionKey => (
    suggestionKey === ownProps.userUid
  ))[0];

  const returnObj = {
    suggestions: key ? state.suggestionReducer[key] : [],
    otherProps: ownProps,
    what: what + 1,
  };

  debug('ReturnObject (props for Suggestions):', returnObj);
  return returnObj;
};

/*eslint-disable */
const createGuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random()* 16 | 0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};
/*eslint-enable */


const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onAddSuggestion: ((suggestion) => {
      debug('Adding suggestion', suggestion, user.getUserEmail(), ownProps.userUid);
      dispatch(addSuggestion(suggestion, user.getUserEmail(), ownProps.userUid, createGuid()));
      suggestionsFirebase.saveSuggestions(store.getState().suggestionReducer);
    }),
  }
);

class Suggestions extends React.PureComponent {

  render() {
    debug('Render: this.props: ', this.props);
    let suggestionList = '';
    if (this.props.suggestions) {
      suggestionList = this.props.suggestions.map((suggestion) => {
        debug('Suggestion: ', suggestion);
        return (<Suggestion key={suggestion.id} suggestion={suggestion} userUid={this.props.userUid} />);
      });
    }

    return (
      <div>
        <h2>Dette er forslag til hva {this.props.username} ønsker seg</h2>
        {suggestionList}
        <AddSuggestion onClick={suggestion => this.props.onAddSuggestion(suggestion)} />
      </div>
    );
  }
}

Suggestions.propTypes = {
  suggestions: array,
  userUid: string,
  username: string,
  onAddSuggestion: func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Suggestions);
