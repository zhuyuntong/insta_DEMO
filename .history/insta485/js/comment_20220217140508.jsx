import React from 'react';
import PropTypes from 'prop-types';

class Comment extends React.Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      // commentid: this.props.commentid,
      // lognameOwnsThis: false,
      // owner: "",
      // ownerShowUrl: "",
      // text: "",
      // url: "",
    };

    // This binding is necessary to make `this` work in the callback
    this.changeComment = this.changeComment.bind(this);
  }

  componentDidMount() {
    // const { link } = this.props;
    // let index = this.props.index;
    // fetch(link, { credentials: "same-origin" })
    //   .then((response) => {
    //     if (!response.ok) throw Error(response.statusText);
    //     return response.json();
    //   })
    //   .then((data) => {
    //     this.setState({
    //       // lognameOwnsThis: data[index].lognameOwnsThis,
    //       // owner: data[index].owner,
    //       // ownerShowUrl: data[index].ownerShowUrl,
    //       // text: data[index].text,
    //       // url: data[index].url,
    //     });
    //   })
    //   .catch((error) => console.log(error));
  }

  changeComment(event) {
    this.props.onChangeComment(event.target.value);
  }

  render() {
    // FIXME: DELETE COMMENT BUTTON for logged-in users
    const { lognameOwnsThis } = this.props;
    const { commentid } = this.props;
    const { ownerShowUrl } = this.props;
    const { owner } = this.props;
    const { text } = this.props;
    let button;
    if (lognameOwnsThis === true) {
      button = (
        <button
          type="button"
          className="delete-comment-button"
          value={commentid}
          onClick={this.changeComment}
        >
          delete comment
        </button>
      );
    }

    return (
      <div className="SAINT-EILEEN">
        <a href={ownerShowUrl}>{owner}</a>
        {' '}
        {text}
        {button}
      </div>
    );
  }
}

Comment.propTypes = {
  lognameOwnsThis: PropTypes.string.isRequired,
  commentid: PropTypes.isRequired,
  ownerShowUrl: PropTypes.isRequired,
  owner: PropTypes.isRequired,
  text: PropTypes.isRequired,
  onChangeCOmment: PropTypes.isRequired,
};

export default Comment;
