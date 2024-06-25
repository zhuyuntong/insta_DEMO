/* eslint-disable react/destructuring-assignment */
import React from "react";
import PropTypes from "prop-types";

class Likes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      : 0,
      lognam_likes: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    let method = this.state.logname_likes_this ? "DELETE" : "POST";
    let change = this.state.logname_likes_this ? -1 : 1;
    fetch(this.props.url1, {
      method: method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify('')
    })
      .then((response) => {
        if (!response.status == 204) throw Error(response.statusText);
        this.setState((state) => ({
          num_likes: state.num_likes + change,
          logname_likes_this: !state.logname_likes_this,
        }));
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    // Call REST API
    fetch(this.props.url1, { credentials: "include" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        this.setState({
          num_likes: data.likes_count,
          logname_likes_this: data.logname_likes_this,
        });
      })
      .catch((error) => console.log(error));

    fetch(this.props.url2, { credentials: "include" })
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
            {this.state.num_likes} like{this.state.num_likes !== 1 ? "s" : ""}
          </p>
        </div>
        {comments}
        <button className="like-unlike-button" onClick={this.handleClick}>
          {this.state.logname_likes_this ? "unlike" : "like"}
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
