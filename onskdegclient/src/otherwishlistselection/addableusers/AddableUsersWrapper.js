import { connect } from 'react-redux';

import AddableUsers from './AddableUsers';

const AddableUserWrapper = connect(
    ({ user }) => (
      {
        user
      }
    ),
    undefined
)(AddableUsers);

export default AddableUserWrapper;
