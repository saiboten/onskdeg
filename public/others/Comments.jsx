// @flow
let debug = require('debug')('Comments');

import React from 'react';
import firebase from '../firebase/firebase';
import user from '../common/User';
import moment from 'moment';

require('./comments.css');

var Comments = React.createClass({

  getInitialState() {
    debug("getInitialState");
    return {
      comment: "",
      comments: [],
      feedback: ""
    }
  },

  componentDidMount() {
    debug("componentDidMount");

    var commentsRef = firebase.database().ref('comments/'+this.props.params.name);
    commentsRef.on('value', snapshot => {
      if(snapshot.val() != null ) {
        var list = snapshot.val();
        debug("Comments list :", list);
        this.setState({
          comments: list
        });
      }
    });
  },

  updateCommentState(e: Event) {
    debug("updateCommentState",e);
    this.setState({
      comment: e.target.value
    })

  },

  addComment(e: Event) {
    debug("addComment", e);

    e.preventDefault();

    if(this.state.comment === "") {
      this.setState({
        feedback: "Kommentaren kan ikke være tom"
      })
      return;
    }

    debug("Adding comment: ", this.state.comment);
    var comments = this.state.comments.slice();

    comments.push({
      user: user.getUserEmail(),
      comment: this.state.comment,
      time: moment().format()
    });

    debug("New comment list: ", comments);
    firebase.database().ref('comments/'+this.props.params.name).set(comments);
    this.setState({
      comments: comments,
      comment: "",
      feedback: ""
    })
  },

  render() {

    var comments = this.state.comments.map(comment => {
      debug("Comment: ", comment.comment);
      return (
        <div className="comments__comment-wrapper smallspace">
          <div className="comments__comment-comment">{comment.comment}</div>
          <div  className="comments__comment-writtenby">Skrevet av {comment.user} - {comment.time ? moment(comment.time).format("DD.MM.YY, H:mm") : ""}</div>
        </div>)
    })

    return (
      <div>
        <div className="comments__add-comment-container">
          <textarea onChange={this.updateCommentState} className="other-wishlist__comment-input" value={this.state.comment} placeholder="Kommenter"></textarea>
          <div className="flex-row space-between">
            <a className="smallspace button" href="#" onClick={this.addComment}>Lagre kommentar</a>
            <div>{this.state.feedback}</div>
          </div>
        </div>

        <div className="comments_comments-wrapper">
          {comments}
        </div>
      </div>
    )
  }
});

module.exports = Comments;
