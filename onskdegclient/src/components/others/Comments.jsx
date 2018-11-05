import React from 'react';
import { any } from 'prop-types';
import moment from 'moment';
import firebase from '../firebase/firebase';

const debug = require('debug')('Comments');

require('./comments.css');

class Comments extends React.Component {
  constructor() {
    super();
    debug('constructor');
    this.state = {
      comment: '',
      comments: [],
      feedback: '',
    };
    this.updateCommentState = this.updateCommentState.bind(this);
    this.addComment = this.addComment.bind(this);
  }

  componentDidMount() {
    debug('componentDidMount');
    const { params: { name } } = this.props;

    const commentsRef = firebase.database().ref(`comments/${name}`);
    commentsRef.on('value', (snapshot) => {
      if (snapshot.val() != null) {
        const list = snapshot.val();
        debug('Comments list :', list);
        this.setState({
          comments: list,
        });
      }
    });
  }

  updateCommentState(e) {
    debug('updateCommentState', e);
    this.setState({
      comment: e.target.value,
    });
  }

  addComment(e) {
    debug('addComment', e);
    const { user, params: { name } } = this.props;
    const { comment, comments } = this.state;

    e.preventDefault();

    if (comment === '') {
      this.setState({
        feedback: 'Kommentaren kan ikke være tom',
      });
      return;
    }

    debug('Adding comment: ', comment);

    const newElem = {
      user: user.email,
      comment,
      time: moment().format(),
    };

    const commentsCopy = [newElem, ...comments];

    debug('New comment list: ', commentsCopy);
    firebase.database().ref(`comments/${name}`).set(commentsCopy);
    this.setState({
      comments: commentsCopy,
      comment: '',
      feedback: '',
    });
  }

  render() {
    const { comments, comment, feedback } = this.state;

    const commentsRevamped = comments.map((oneComment) => {
      debug('Comment: ', oneComment);
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
            <button type="button" className="smallspace button button--padded" href="#" onClick={this.addComment}>Lagre kommentar</button>
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

Comments.propTypes = {
  params: any,
  user: any,
};

export default Comments;
