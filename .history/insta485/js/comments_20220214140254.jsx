/* eslint-disable quotes */
import React from "react";
import PropTypes from "prop-types";

class Comments extends React.Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      comments: [],
      value: "",
    };

    // This binding is necessary to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
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

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch(this.props.url2, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: this.state.value }),
    })
      .then((response) => {
        if (!response.status === 201) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        this.setState((state) => ({
          comments: state.comments.concat([data]),
        }));
      })
      .catch((error) => console.log(error));
    this.setState({
      value: "",
    });
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
