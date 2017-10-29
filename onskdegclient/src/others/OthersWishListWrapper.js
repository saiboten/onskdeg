import { connect } from 'react-redux';

import OthersWishList from './OthersWishList';

const OthersWishListWrapper = connect(
    ({ user }) => (
      {
        user
      }
    ),
    undefined
)(OthersWishList);

export default OthersWishListWrapper;
