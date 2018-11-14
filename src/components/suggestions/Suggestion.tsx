import React from 'react';
// import { any, func } from 'prop-types';
// import { connect } from 'react-redux';

// import { checkSuggestion, deleteSuggestion } from '../../state/actions/suggestion';

// import OtherWish from '../others/OtherWish';
// import suggestionsFirebase from './suggestionsFirebase';
// import store from '../../store';

// const debug = require('debug')('Suggestion');

// const counter = 0;

// interface P {
//   suggestion:  () => 
//   onCheckSuggestion:
//   onDeleteSuggestion
// }

// interface S {

// }

// class Suggestion extends React.PureComponent<P,S> {
//   render() {
//     const { suggestion, onCheckSuggestion, onDeleteSuggestion } = this.props;
//     const wishInfo = {
//       checked: suggestion.checked,
//       name: suggestion.wishSuggestion,
//       id: suggestion.id,
//       checkedby: suggestion.checkedBy,
//     };

//     const { user } = this.props;

//     return (
//       <div className="flex-column">
//         <OtherWish
//           wishInfo={wishInfo}
//           onClick={onCheckSuggestion}
//           suggestedBy={suggestion.suggestedBy}
//           deleteSuggestion={onDeleteSuggestion}
//           canDelete={user.email === suggestion.suggestedBy}
//         />
//       </div>
//     );
//   }
// }

// export default connect(null, null)(Suggestion);
