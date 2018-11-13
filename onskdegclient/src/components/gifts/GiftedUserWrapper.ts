import { connect } from 'react-redux';

import GiftedUser from './GiftedUser';

const GiftedUserWrapper = connect(
  ({ user, users }) => (
    {
      user,
      users,
    }
  ),
  undefined,
)(GiftedUser);

export default GiftedUserWrapper;
