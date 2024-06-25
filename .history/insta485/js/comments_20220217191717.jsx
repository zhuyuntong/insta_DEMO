import React from 'react';
import PropTypes from 'prop-types';
import Comment from './comment';

class Comments extends React.Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      // postid: -1,
      // comments: [],
      // value: "",
    };

    // This binding is necessary to make `this` work in the callback
    // this.handleCommentClick = this.handleCommentClick.bind(this);
    this.changeCommentSubmit = this.changeCommentSubmit.bind(this);
    this.changeCommentState = this.changeCommentState.bind(this);
    this.changeCommentDelete = this.changeCommentDelete.bind(this);
  }

  componentDidMount() {
    // const { link } = this.props;
    // fetch(link, { credentials: "same-origin" })
    //   .then((response) => {
    //     if (!response.ok) throw Error(response.statusText);
    //     return response.json();
    //   })
    //   .then((data) => {
    //     // console.log(data);
    //     this.setState({
    //       comments: data.comments,
    //       postid: data.postid,
    //     });
    //   })
    //   .catch((error) => console.log(error));
  }

  // handleCommentClick() {
  //   let deleteurl = this.props.url;

  //   fetch(deleteurl, {
  //     credentials: "same-origin",
  //     // body: JSON.stringify('')
  //   });
  // }

  changeCommentState(event) {
    event.preventDefault();
    const { onChangeCommentState } = this.props;
    onChangeCommentState(event.target.value);
  }

  changeCommentSubmit(event) {
    event.preventDefault();
    const { onChangeCommentSubmit } = this.props;
    onChangeCommentSubmit();
  }

  changeCommentDelete(value) {
    const { onChangeCommentDelete } = this.props;
    onChangeCommentDelete(value);
  }

  render() {
    const commentss = [];
    const { comments } = this.props;
    const { link } = this.props;
    const { value } = this.props;
    // this.state.comments.entries().forEach((val, comment) => {
    // for (const [val, comment] of comments.entries()) {
    commentss = comments.map(([key, comment]) => (
      // commentss.push(
      <Comment
        link={link}
        commentid={comment.commentid}
        lognameOwnsThis={comment.lognameOwnsThis}
        owner={comment.owner}
        ownerShowUrl={comment.ownerShowUrl}
        text={comment.text}
        url={comment.url}
        onChangeComment={this.changeCommentDelete}
        key={key}
      />
      // );
    ));

    return (
      <div className="SAINT-BELLA">
        {commentss}
        <form className="comment-form" onSubmit={this.changeCommentSubmit}>
          <input
            type="text"
            value={value}
            onChange={this.changeCommentState}
          />
          <input type="submit" name="comment" value="comment" />
        </form>
      </div>
    );
  }
}

Comments.propTypes = {
  onChangeCommentState: PropTypes.func.isRequired,
  onChangeCommentSubmit: PropTypes.func.isRequired,
  onChangeCommentDelete: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({ comment: PropTypes.string })).isRequired,
  link: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Comments;
