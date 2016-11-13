import React from 'react';
var debug = require('debug')('Suggestion');
import {checkSuggestion} from '../../../actions/suggestionActions';
import {deleteSuggestion} from '../../../actions/suggestionActions';

import { connect } from 'react-redux'
import OtherWish from '../OtherWish';
import user from '../../../common/User'
var counter = 0;
import suggestionsListener from '../../../listeners/suggestionsListener';
import store from '../../../store';

const mapStateToProps = function(state, ownProps) {

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
    onCheckSuggestion: function() {
      dispatch(checkSuggestion(ownProps.userUid, ownProps.suggestion.id, user.getUserEmail()));
      suggestionsListener.saveSuggestions(store.getState().suggestionReducer);
    },
    onDeleteSuggestion: function() {
      dispatch(deleteSuggestion(ownProps.userUid, ownProps.suggestion.id));
      suggestionsListener.saveSuggestions(store.getState().suggestionReducer);
    }
  }
};

var Suggestion = React.createClass({

  render() {
    debug("This.props.suggestion: ", this.props.suggestion);

    var wishInfo = {
      checked: this.props.suggestion.checked,
      name: this.props.suggestion.wishSuggestion,
      id: this.props.suggestion.id,
      checkedby: this.props.suggestion.checkedBy
    };

    var deleteMe = user.getUserEmail() === this.props.suggestion.suggestedBy ? (<input className="button smallspace" type="button" onClick={this.props.onDeleteSuggestion} value="Slett"></input>) : "";

    return (
      <div className="flex-column">

          <OtherWish wishInfo={wishInfo} onClick={this.props.onCheckSuggestion} />
          <div className="flex-row space-between">
            <div className="smallspace">Foreslått av {this.props.suggestion.suggestedBy}</div>
            {deleteMe}
         </div>
      </div>
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps)(Suggestion)
