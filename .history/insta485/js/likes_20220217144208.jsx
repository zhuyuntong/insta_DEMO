import React from 'react';
import PropTypes from 'prop-types';

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
    // const { link } = this.props;
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
    const { onChangeLikeState } = this.props;
    onChangeLikeState();
  }

  render() {
    let button;
    const { lognamelikes } = this.props;
    if (lognamelikes === true) {
      button = (
        <button
          type="button"
          className="like-unlike-button"
          onClick={this.changeLikes}
        >
          unlike
        </button>
      );
    } else if (lognamelikes === false) {
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
    const { totallikes } = this.props;
    let plural = 'like';
    if (totallikes !== 1) {
      plural = 'likes';
    }
    return (
      <div className="SAINT-DIANA">
        <p>
          {/* {this.props.total_likes}
          <span>&nbsp;</span>
          {plural} */}
          {`${totallikes} ${plural}`}
        </p>
        {/* button for user */}
        {button}
      </div>
    );
  }
}

Likes.propTypes = {
  onChangeLikeState: PropTypes.isRequired,
  lognamelikes: PropTypes.isRequired,
  totallikes: PropTypes.isRequired,
};

export default Likes;
