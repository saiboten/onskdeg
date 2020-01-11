import { connect } from 'react-redux';

import AddableUsers from './AddableUsers';
import { User } from '../../../types/types';

const AddableUserWrapper = connect(
  ({ user }: { user: User}) => (
    {
      user,
    }
  ),
  undefined,
)(AddableUsers);

export default AddableUserWrapper;
