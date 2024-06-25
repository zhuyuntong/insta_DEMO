/* eslint-disable quotes */
/* eslint-disable react/destructuring-assignment */
import React from "react";
import PropTypes from "prop-types";

class Likes extends React.Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      total_likes: 0,
      logname_likes: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    // This line automatically assigns this.props.url to the const variable url
    const { url } = this.props;

    // Call REST API
    fetch(url, { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        this.setState({
          total_likes: data.likes_count,
          logname_likes: data.logname_likes,
        });
      })
      .catch((error) => console.log(error));
  }

  handleClick() {
    // let change = this.state.logname_likes_this ? -1 : 1;
    // let temp = this.state.total_likes;
    let addone = 1;
    if (this.state.logname_likes === true) {
      addone = -1;
    }
    this.setState((state) => ({
      total_likes: state.total_likes + addone,
      logname_likes: !state.logname_likes,
    }));
  }

  render() {
    const id = "text" + this.props.postid;
    const comments = [];
    for (const [index, comment] of this.state.comments.entries()) {
      comments.push(
        <div key={index} style={{ height: "6vh", margin: "1vh 2px" }}>
          <strong>
            <a href={comment.owner_show_url}>{comment.owner}</a>
          </strong>{" "}
          {comment.text}
        </div>,
      );
    }

    return (
      <div className="likes_comments">
        <div style={{ height: "6vh", margin: "1vh 2px" }}>
          <p>
            {this.state.total_likes} like
            {this.state.total_likes !== 1 ? "s" : ""}
          </p>
        </div>
        {comments}
        <button className="like-unlike-button" onClick={this.handleClick}>
          {this.state.lognam_likes ? "unlike" : "like"}
        </button>
        <form onSubmit={this.handleSubmit}>
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
