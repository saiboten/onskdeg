var React = require('react');
var debug = require('debug')('Comments');
var firebase = require('../../common/firebase/firebase')
var user = require('../../common/User');
var moment = require('moment');

require('./comments.css');

var Comments = React.createClass({

  getInitialState() {
    return {
      comment: "",
      comments: []
    }
  },

  componentDidMount() {
    var that = this;
    var commentsRef = firebase.database().ref('comments/'+this.props.params.name);
    commentsRef.on('value', function(snapshot) {
      if(snapshot.val() != null ) {
        var list = snapshot.val();
        debug("Comments list :", list);
        that.setState({
          comments: list
        });
      }
    });
  },

  updateCommentState(e) {
    this.setState({
      comment: e.target.value
    })
  },

  addComment(e) {
    e.preventDefault();
    debug("Adding comment: ", this.state.comment);
    var comments = Object.assign([],this.state.comments);

    comments.push({
      user: user.getUserEmail(),
      comment: this.state.comment,
      time: moment().format()
    });

    debug("New comment list: ", comments);
    firebase.database().ref('comments/'+this.props.params.name).set(comments);
    this.setState({
      comments: comments,
      comment: ""
    })
  },

  render() {

    var comments = this.state.comments.map(function(comment) {
      debug("Comment: ", comment.comment);
      return (
        <div className="comments__comment-wrapper">
          <div className="comments__comment-comment">{comment.comment}</div>
          <div  className="comments__comment-writtenby">Skrevet av {comment.user} - {comment.time ? moment(comment.time).format("DD.MM.YY, H:mm") : ""}</div>
        </div>)
    })

    return (
      <div>
        <div className="comments__add-comment-container">
          <textarea onChange={this.updateCommentState} className="other-wishlist__comment-input" value={this.state.comment} placeholder="Kommenter"></textarea>
          <a className="comments__add-comment-button button" href="#" onClick={this.addComment}>Lagre</a>
        </div>

        <div className="comments_comments-wrapper">
          {comments}
        </div>
      </div>
    )
  }
});

module.exports = Comments;
