import { connect } from 'react-redux';

import Comments from './Comments';

const CommentsWrapper = connect(
    ({ user }) => (
      {
        user
      }
    ),
    undefined
)(Comments);

export default CommentsWrapper;
