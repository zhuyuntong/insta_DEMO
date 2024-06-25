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
          total_likes: data.numLikes,
          logname_likes: data.lognameLikesThis,
        });
      })
      .catch((error) => console.log(error));
  }

  handleClick() {
    // let change = this.state.logname_likes ? -1 : 1;
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
    return (
      <div className="SAINT.DIANA">
        <p> {this.state.total_likes} </p>
        if (this.state.total_likes !== 1) <p>s</p>
        <button
          type="button"
          className="like-unlike-button"
          onClick={this.handleClick}
        >
          {this.state.logname_likes ? "unlike" : "like"}
        </button>
      </div>
    );
  }
}
