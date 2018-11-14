import { connect } from 'react-redux';

import Comments from './Comments';
import { ApplicationState } from '../../state/reducers';

const mapStateToProps = ({ user }: ApplicationState) => ({ user });
const CommentsWrapper = connect(mapStateToProps)(Comments);

export default CommentsWrapper;
