import { connect } from 'react-redux';

import ChoosePath from './ChoosePath';

const ChoosePathWrapper = connect(
    ({ allUsers, user }) => (
      {
        users: allUsers,
        user
      }
    ),
    undefined
)(ChoosePath);

export default ChoosePathWrapper;
