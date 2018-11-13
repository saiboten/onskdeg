import { connect } from 'react-redux';

import ChoosePath from './ChoosePath';

const ChoosePathWrapper = connect(
  ({ users, user }) => (
    {
      users,
      user,
    }
  ),
)(ChoosePath);

export default ChoosePathWrapper;
