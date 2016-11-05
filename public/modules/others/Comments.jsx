var React = require('react');
var debug = require('debug')('Comments');
var firebase = require('../../common/firebase/firebase')
var user = require('../../common/User');

require('./otherwishlist.css');

var Comments = React.createClass({

  getInitialState() {
    return {
      comment: "",
      comments: []
    }
  },

  componentDidMount() {
    var that = this;
    var commentsRef = firebase.database().ref('comments/'+this.props.params.name.toLowerCase());
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
    debug("Adding comment: ", this.state.comment);
    var comments = Object.assign([],this.state.comments);

    comments.push({
      user: user.getUser(),
      comment: this.state.comment
    });

    debug("New comment list: ", comments);
    firebase.database().ref('comments/'+this.props.params.name.toLowerCase()).set(comments);
    this.setState({
      comments: comments,
      comment: ""
    })
  },

  render() {

    var comments = this.state.comments.map(function(comment) {
      debug("Comment: ", comment.comment);
      return (<div className="other-wishlist__comment-wrapper"><div className="other-wishlist__comment-comment">{comment.comment}</div><div  className="other-wishlist__comment-writtenby">Skrevet av {comment.user}</div></div>)
    })

    return (
      <div>
        {comments}

        <div>
          <textarea onChange={this.updateCommentState} className="other-wishlist__comment-input" placeholder="Kommenter" />
          <button onClick={this.addComment}>Legg til kommentar</button>
        </div>
      </div>
    )
  }
});

module.exports = Comments;
