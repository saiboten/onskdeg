import { connect } from 'react-redux';

import NameSelect from './NameSelect';

const NameSelectWrapper = connect(
    ({ user }) => (
      {
        user
      }
    ),
    undefined
)(NameSelect);

export default NameSelectWrapper;
