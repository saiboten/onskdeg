import { connect } from 'react-redux';

import OthersWishListSelection from './OthersWishListSelection';

const OthersWishListSelectionWrapper = connect(
    ({ user }) => (
      {
        user
      }
    ),
    undefined
)(OthersWishListSelection);

export default OthersWishListSelectionWrapper;
