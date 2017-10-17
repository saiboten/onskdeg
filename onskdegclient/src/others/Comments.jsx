// @flow

import React from 'react';
import { any } from 'prop-types';
import moment from 'moment';
import firebase from '../firebase/firebase';
import user from '../common/User';

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

    const commentsRef = firebase.database().ref(`comments/${this.props.params.name}`);
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

  updateCommentState(e /* : Event*/) {
    debug('updateCommentState', e);
    this.setState({
      comment: e.target.value,
    });
  }

  addComment(e /* : Event*/) {
    debug('addComment', e);

    e.preventDefault();

    if (this.state.comment === '') {
      this.setState({
        feedback: 'Kommentaren kan ikke være tom',
      });
      return;
    }

    debug('Adding comment: ', this.state.comment);
    const comments = this.state.comments.slice();

    comments.push({
      user: user.getUserEmail(),
      comment: this.state.comment,
      time: moment().format(),
    });

    debug('New comment list: ', comments);
    firebase.database().ref(`comments/${this.props.params.name}`).set(comments);
    this.setState({
      comments,
      comment: '',
      feedback: '',
    });
  }

  render() {
    const comments = this.state.comments.map((comment) => {
      debug('Comment: ', comment.comment);
      return (
        <div className="comments__comment-wrapper smallspace">
          <div className="comments__comment-comment">{comment.comment}</div>
          <div className="comments__comment-writtenby">
            Skrevet av {comment.user} - {comment.time ? moment(comment.time).format('DD.MM.YY, H:mm') : ''}
          </div>
        </div>);
    });

    return (
      <div>
        <div className="comments__add-comment-container">
          <textarea
            onChange={this.updateCommentState}
            className="other-wishlist__comment-input"
            value={this.state.comment}
            placeholder="Kommenter"
          />
          <div className="flex-row space-between">
            <button className="smallspace button" href="#" onClick={this.addComment}>Lagre kommentar</button>
            <div>{this.state.feedback}</div>
          </div>
        </div>

        <div className="comments_comments-wrapper">
          {comments}
        </div>
      </div>
    );
  }
}

Comments.propTypes = {
  params: any,
};

export default Comments;
