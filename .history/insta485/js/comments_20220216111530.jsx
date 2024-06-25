/* eslint-disable linebreak-style */
/* eslint-disable quotes */
import React from "react";
import PropTypes from "prop-types";
import Comment from "./comment";

class Comments extends React.Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      postid: -1,
      comments: [],
      value: "",
    };

    // This binding is necessary to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { link } = this.props;

    fetch(link, { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        this.setState({
          comments: data.comments,
          postid: data.postid,
        });
      })
      .catch((error) => console.log(error));
  }

  handleClick() {
    let deleteurl = this.props.url;

    fetch(deleteurl, {
      credentials: "same-origin",
      // body: JSON.stringify('')
    });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { postid } = this.state;
    const { value } = this.state;
    let newurl = "/api/v1/comments/?postid=";
    newurl.concat(postid);

    fetch(newurl, {
      credentials: "same-origin",
      body: JSON.stringify({ text: value }),
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
    let commentss = [];
    let indexx = 0;
    // this.state.comments.entries().forEach((val, comment) => {
    for (const [val, comment] of this.state.comments.entries()) {
      commentss.push(
        <Comment
          link={this.props.link}
          commentid={comment.commentid}
          lognameOwnsThis={comment.lognameOwnsThis}
          owner={comment.owner}
          ownerShowUrl={comment.ownerShowUrl}
          text={comment.text}
          url={comment.url}
          onChangeComment={comment.handleClick}
          key={val}
        />,
      );
      indexx += 1;
    }

    return (
      <div className="SAINT-BELLA">
        {commentss}
        <form className="commment-form" onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <input type="submit" name="comment" value="comment" />
        </form>
      </div>
    );
  }
}

export default Comments;
