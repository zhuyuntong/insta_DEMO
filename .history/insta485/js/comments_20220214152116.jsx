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
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleClick() {
    // This line automatically assigns this.props.url to the const variable url
    const { link } = this.props;
    // Call REST API to get the post's information
    
    // let addone = 1;
    // if (this.state.logname_likes === true) {
    //   addone = -1;
    // }
    // this.setState((state) => ({
    //   total_likes: state.total_likes + addone,
    //   logname_likes: !state.logname_likes,
    // }));
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
