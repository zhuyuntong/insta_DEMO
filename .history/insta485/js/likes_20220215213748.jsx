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
      // .then((data) => {
      // console.log(data);
      // this.setState({

      // });
      // })
      .catch((error) => console.log(error));
  }

  // this.setState((state) => ({
  //   total_likes: state.total_likes + addone,
  //   logname_likes: !state.logname_likes,
  // }));
  // change state
  // handleChange(e) {
  //   this.props.onTemperatureChange(e.target.value);
  // }

  handleClick() {
    // let change = this.state.logname_likes ? -1 : 1;
    // let temp = this.state.total_likes;
    // const { link } = this.props;

    let method;
    if (this.setState.logname_likes === true) {
      method = "DELETE";
    } else if (this.setState.logname_likes === false) {
      method = "POST";
    }
    let newurl;
    if (method === "DELETE") {
      newurl = this.setState.url;
    } else if (method === "POST") {
      newurl = "/api/v1/likes/?postid=";
      newurl = newurl.concat(toString(this.setState.postid));
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
          this.setState({
            url: data.url,
          });
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
  }

  handleDoubleClick() {
    // This line automatically assigns this.props.url to the const variable url
    const { link } = this.props;

    newurl = "/api/v1/likes/?postid=";
    newurl = newurl.concat(toString(this.state.postid));

    fetch(newurl, {
      method,
      credentials: "same-origin",
      // body: JSON.stringify('')
    })
      .then((response) => {
        if (response.status === 201) {
          this.setState((state) => ({
            total_likes: state.total_likes + 1,
            logname_likes: !state.logname_likes,
          }));
        }
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        this.setState({
          url: data.url,
        });
      });
  }

  changeLikes() {
    this.props.onChangeLikeState();
  }

  render() {
    let button;
    if (this.props.logname_likes === true) {
      button = (
        <button
          type="button"
          className="like-unlike-button"
          onClick={this.changeLikes}
        >
          unlike
        </button>
      );
    } else if (this.props.logname_likes === false) {
      button = (
        <button
          type="button"
          className="like-unlike-button"
          onClick={this.changeLikes}
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
