// @flow
var debug = require('debug')('Suggestion');

import React from 'react';
import {checkSuggestion} from './suggestionActions';
import {deleteSuggestion} from './suggestionActions';
import { connect } from 'react-redux'
import OtherWish from '../others/OtherWish';
import user from '../common/User'
import suggestionsFirebase from './suggestionsFirebase';
import store from '../store';

let counter = 0;

const mapStateToProps = (state, ownProps) => {

  var keys = Object.keys(state.suggestionReducer);
  var theRightKey = keys.filter(userid => {
    return userid === ownProps.userUid;
  });

  return {
    suggestion: state.suggestionReducer[theRightKey].filter(suggestion => {
      return suggestion.id === ownProps.suggestion.id;
    })[0],
    counter: counter++
  }
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    onCheckSuggestion() {
      debug('onCheckSuggestion')

      dispatch(checkSuggestion(ownProps.userUid, ownProps.suggestion.id, user.getUserEmail()));
      suggestionsFirebase.saveSuggestions(store.getState().suggestionReducer);
    },
    onDeleteSuggestion() {
      debug('onDeleteSuggestion')

      dispatch(deleteSuggestion(ownProps.userUid, ownProps.suggestion.id));
      suggestionsFirebase.saveSuggestions(store.getState().suggestionReducer);
    }
  }
};

var Suggestion = React.createClass({
  render() {

    var wishInfo = {
      checked: this.props.suggestion.checked,
      name: this.props.suggestion.wishSuggestion,
      id: this.props.suggestion.id,
      checkedby: this.props.suggestion.checkedBy
    };

    var deleteMe = user.getUserEmail() === this.props.suggestion.suggestedBy ? (<input className="button smallspace" type="button" onClick={this.props.onDeleteSuggestion} value="Slett"></input>) : "";

    return (
      <div className="flex-column">

          <OtherWish wishInfo={wishInfo} onClick={this.props.onCheckSuggestion} suggestedBy={this.props.suggestion.suggestedBy} />
          <div className="flex-row space-between">
            {deleteMe}
         </div>
      </div>
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps)(Suggestion)
