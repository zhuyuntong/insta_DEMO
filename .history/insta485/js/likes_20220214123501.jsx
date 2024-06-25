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
      lognam_likes: false,
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
          lognam_likes: data.lognam_likes,
        });
      })
      .catch((error) => console.log(error));
  }
    handleClick() {
    let method;
    if (this.state.logname_likes === true) {
        method = "DELETE";
    } else if (this.state.logname_likes === false) {
        method = "POST";
    }
    // let method = this.state.lognam_likes ? "DELETE" : "POST";
    // let change = this.state.lognam_likes ? -1 : 1;

    fetch(url, {
      method: method,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify('')
    })
      .then((response) => {
        if (!response.status === 204) throw Error(response.statusText);
      })
      .then((data))
        this.setState((state) => ({
          total_likes: state.total_likes + change,
          lognam_likes: !state.lognam_likes,
        }));
      })
      .catch((error) => console.log(error));



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
