import { connect } from 'react-redux';

import Gifts from './Gifts';

const GiftsWrapper = connect(
  ({ user, users }) => (
    {
      user,
      users,
    }
  ),
  undefined,
)(Gifts);

export default GiftsWrapper;
