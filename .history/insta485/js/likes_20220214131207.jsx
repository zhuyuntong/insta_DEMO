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

    // let change = this.state.logname_likes_this ? -1 : 1;
    let temp = total_likes;
    if (this.state.logname_likes === true) {
      temp--;
    } else if (this.state.logname_likes === false) {
      temp++;
    }

    this.setState({
      total_likes: temp,
      logname_likes: !logname_likes,
    });
  }
}
