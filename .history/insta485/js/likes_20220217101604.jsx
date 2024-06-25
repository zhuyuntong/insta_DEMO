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

    // this.handleClick = this.handleClick.bind(this);
    this.changeLikes = this.changeLikes.bind(this);
  }

  componentDidMount() {
    // This line automatically assigns this.props.url to the const variable url
    const { link } = this.props;

    // Call REST API
    // fetch(link, { credentials: "same-origin" })
    //   .then((response) => {
    //     if (!response.ok) throw Error(response.statusText);
    //     return response.json();
    //   })
    //   // .then((data) => {
    //   // console.log(data);
    //   // this.setState({

    //   // });
    //   // })
    //   .catch((error) => console.log(error));
  }

  // this.setState((state) => ({
  //   total_likes: state.total_likes + addone,
  //   logname_likes: !state.logname_likes,
  // }));
  // change state
  // handleChange(e) {
  //   this.props.onTemperatureChange(e.target.value);
  // }

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
    let plural = "like";
    if (this.props.total_likes !== 1) {
      plural = "likes";
    }
    return (
      <div className="SAINT-DIANA">
        <p>
          {/* {this.props.total_likes}
          <span>&nbsp;</span>
          {plural} */}
          {`${this.props.total_likes} ${plural}`}
        </p>
        {/* button for user */}
        {button}
      </div>
    );
  }
}

export default Likes;
