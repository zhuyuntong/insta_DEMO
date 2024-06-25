/* eslint-disable quotes */
import React from "react";
import PropTypes from "prop-types";

class Comments extends React.Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      postid= -1,
      comments: [],
      value: "",
    };

    // This binding is necessary to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let newurl = "/api/v1/comments/?postid=";
    newurl.concat(toString(this.state.postid));

    fetch(newurl, {
      credentials: "same-origin",
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
    let commentss = [];
    let indexx = 0;
    this.state.comments.entries().forEach((val, comment) => {
      commentss.push(
        <Comment
          link={this.props.link}
          commentid={comment.commentid}
          index={indexx}
          key={val}
        />,
      );
      indexx = indexx + 1;
    });

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
