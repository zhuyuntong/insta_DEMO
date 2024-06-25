/* eslint-disable quotes */
/* eslint-disable react/destructuring-assignment */
import React from "react";
import PropTypes from "prop-types";

class Likes extends React.Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      // total_likes: 0,
      // logname_likes: false,
      // url: "",
      // postid: -1,
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
    if (this.props.logname_likes === true) {
      method = "DELETE";
    } else if (this.props.logname_likes === false) {
      method = "POST";
    }
    let newurl;
    if (method === "DELETE") {
      newurl = this.props.url;
    } else if (method === "POST") {
      newurl = "/api/v1/likes/?postid=";
      newurl = newurl.concat(toString(this.props.postid));
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
          // this.setState({
          //   url: data.url,
          // });
        });
    } else {
      fetch(newurl, {
        method,
        credentials: "same-origin",
        // body: JSON.stringify('')
      });
      this.setState({
        url: "",
      });
    }
    let addone = 1;
    if (this.props.logname_likes === true) {
      addone = -1;
    }
    // this.setState((state) => ({
    //   total_likes: state.total_likes + addone,
    //   logname_likes: !state.logname_likes,
    // }));
    // change state
    changeState(s) { 
      this.props. ;
    }
  }

  render() {
    let button;
    if (this.props.logname_likes === true) {
      button = (
        <button
          type="button"
          className="like-unlike-button"
          onClick={this.handleClick}
        >
          unlike
        </button>
      );
    } else if (this.props.logname_likes === false) {
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
    let plural = "";
    if (this.props.total_likes !== 1) {
      plural = "s";
    }
    return (
      <div className="SAINT-DIANA">
        <p>
          {this.props.total_likes}
          <span>&nbsp;</span>
          like
          {plural}
        </p>
        {/* button for user */}
        {button}
      </div>
    );
  }
}

export default Likes;
