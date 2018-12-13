import React from 'react';
import moment from 'moment';
import firebase from '../firebase/firebase';
import { UserState } from '../../state/reducers/types';

require('./comments.css');

interface Comment {
  user?: string;
  time: string;
  comment: string;
}

interface CommentsProps {
  user: UserState;
  params: { name: string };
  comments: Comment[];
}

interface CommentsState {
  comment: string;
  comments?: Comment[];
  feedback: string;
}

class Comments extends React.Component<CommentsProps, CommentsState> {
  commentsRef?: firebase.database.Reference;

  constructor(props: any) {
    super(props);
    this.state = {
      comment: '',
      feedback: '',
    };
    this.updateCommentState = this.updateCommentState.bind(this);
    this.addComment = this.addComment.bind(this);
    this.commentsRef = undefined;
  }



  componentDidMount() {
    const { params: { name } } = this.props;

    this.commentsRef = firebase.database().ref(`comments/${name}`);
    this.commentsRef.on('value', snapshot => {
      const list = snapshot && snapshot.val();
      if (list != null) {
        // TODO action
      }
    });
  }

  componentWillUnmount() {
    this.commentsRef && this.commentsRef.off();
  }

  updateCommentState(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      comment: e.target.value,
    });
  }

  addComment(e: React.MouseEvent<HTMLElement>) {
    const { user, comments, params: { name } } = this.props;
    const { comment } = this.state;

    e.preventDefault();

    if (comment === '') {
      this.setState({
        feedback: 'Kommentaren kan ikke være tom',
      });
      return;
    }

    const newElem = {
      user: user.email,
      comment,
      time: moment().format(),
    };

    const commentsCopy = [newElem, ...comments];

    firebase.database().ref(`comments/${name}`).set(commentsCopy);
    this.setState({
      comments: commentsCopy,
      comment: '',
      feedback: '',
    });
  }

  render() {
    const { comment, feedback } = this.state;
    const { comments } = this.props;

    const commentsRevamped = comments.map((oneComment) => {
      return (
        <div key={oneComment.time} className="comments__comment-wrapper smallspace">
          <div className="comments__comment-comment">{oneComment.comment}</div>
          <div className="comments__comment-writtenby">
            {`Skrevet av ${oneComment.user} - `}
            {oneComment.time && moment(oneComment.time).format('DD.MM.YY, H:mm')}
          </div>
        </div>);
    });

    return (
      <div>
        <div className="comments__add-comment-container">
          <textarea
            onChange={this.updateCommentState}
            className="other-wishlist__comment-input"
            value={comment}
            placeholder="Kommenter"
          />
          <div className="flex-row space-between">
            <button type="button" className="smallspace button button--padded" onClick={this.addComment}>Lagre kommentar</button>
            <div>{feedback}</div>
          </div>
        </div>

        <div className="comments_comments-wrapper">
          {commentsRevamped}
        </div>
      </div>
    );
  }
}


export default Comments;
