import { connect } from 'react-redux';

import OthersWishListSelection from './OthersWishListSelection';

const OthersWishListSelectionWrapper = connect(
  ({ user, users, suggestion }) => (
    {
      user,
      users,
      suggestion,
    }
  ),
  undefined,
)(OthersWishListSelection);

export default OthersWishListSelectionWrapper;
