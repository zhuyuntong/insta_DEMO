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
      url: "",
      postid: -1,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    // This line automatically assigns this.props.url to the const variable url
    const { link } = this.props;

    // Call REST API
    fetch(link, { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        this.setState({
          total_likes: data.likes.numLikes,
          logname_likes: data.likes.lognameLikesThis,
          url: data.likes.url,
          postid: data.postid,
        });
      })
      .catch((error) => console.log(error));
  }

  handleClick() {
    // let change = this.state.logname_likes ? -1 : 1;
    // let temp = this.state.total_likes;
    // const { link } = this.props;

    let method;
    if (this.state.logname_likes === true) {
      method = "DELETE";
    } else if (this.state.logname_likes === false) {
      method = "POST";
    }
    let newurl;
    if (method === "DELETE") {
      newurl = this.state.url;
    } else if (method === "POST") {
      newurl = "/api/v1/likes/?postid=";
      newurl = newurl.concat(toString(this.state.postid));
    }

    // = this.state.logname_likes ? "DELETE" : "POST";
    if (method === "POST") {
      fetch(newurl, {
        method,
        credentials: "same-origin",
        // body: JSON.stringify('')
      })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
          this.setState((state) => ({
            url: state.url,
          }));
        });
    }
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
    let button;
    if (this.state.logname_likes === true) {
      button = (
        <button
          type="button"
          className="like-unlike-button"
          onClick={this.handleClick}
        >
          unlike
        </button>
      );
    } else if (this.state.logname_likes === false) {
      button = (
        <button
          type="button"
          className="like-unlike-button"
          onClick={this.handleClick}
        >
          like
        </button>
      );
    }
    return (
      <div className="SAINT-DIANA">
        <p>{this.state.total_likes}</p>
        {/* syntax (s) */}
        if (this.state.total_likes !== 1)
        <p>s</p>
        {/* button for user */}
        {button}
      </div>
    );
  }
}
