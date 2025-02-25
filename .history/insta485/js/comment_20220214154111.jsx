/* eslint-disable quotes */
import React from "react";
import PropTypes from "prop-types";

class Comment extends React.Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      commentid: -1,
      lognameOwnsThis: false,
      owner: "",
      ownerShowUrl: "",
      text: "",
      url: ""
    };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    fetch(this.props.link, { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        this.setState({
          comments: data.comments,
        });
      })
      .catch((error) => console.log(error));
  }

  render() {
    const id = "text" + this.props.postid;
    const comments = [];
    for (const [index, comment] of this.state.comments.entries()) {
      comments.push(
        <div key={index}>
          <strong>
            <a href={comment.owner_show_url}>{comment.owner}</a>
          </strong>{" "}
          {comment.text}
        </div>,
      );
    }
    // FIXME: DELETE COMMENT BUTTON for logged-in users
    // let button;
    // if (this.state.logname_likes === true) {
    //   button = (
    //     <button
    //       type="button"
    //       className="delete-comment-button"
    //       onClick={this.handleClick}
    //     >
    //       unlike
    //     </button>
    //   );
    // }

    return (
      <div className="SAINT-EILEEN">
        </div>
        {comments}
        <form className="commment-form" onSubmit={this.handleSubmit}>
          <input
            type="text"
            id={id}
            value={this.state.value}
            onChange={this.handleChange}
          />
          <input type="submit" name="comment" value="comment" />
        </form>
      </div>
    );
  }
}
