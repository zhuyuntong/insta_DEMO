/* eslint-disable quotes */
import React from "react";
import PropTypes from "prop-types";
import moment from "moment/src/moment";
import Likes from "./likes";
import Comments from "./comments";
// Newly added
// import InfiniteScroll from "react-infinite-scroll-component";

class Post extends React.Component {
  /* Display number of image and post owner of a single post
   */

  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      created: "",
      imgUrl: "",
      owner: "",
      ownerImgUrl: "",
      ownerShowUrl: "",
      postShowUrl: "",
    };
  }

  componentDidMount() {
    // This line automatically assigns this.props.url to the const variable url
    const { link } = this.props;

    // Call REST API to get the post's information
    fetch(link, { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        this.setState({
          created: data.created,
          imgUrl: data.imgUrl,
          owner: data.owner,
          ownerImgUrl: data.ownerImgUrl,
          ownerShowUrl: data.ownerShowUrl,
          postShowUrl: data.postShowUrl,
        });
      })
      .catch((error) => console.log(error));
  }

  render() {
    // This line automatically assigns this.state.imgUrl to the const variable imgUrl
    // and this.state.owner to the const variable owner
    const { state } = this.state;
    const { props } = this.props;

    const momentcreated = moment(state.created).fromNow();
    const Likess = <Likes link={props.link} />;
    const Commentss = <Comments link={props.link} />;
    // Render number of post image and post owner
    return (
      <div className="SAINT-AVA">
        <img src={state.ownerImgUrl} alt={state.owner} />
        <a href={state.ownerShowUrl}>{state.owner}</a>
        <a href={state.postShowUrl}>{momentcreated}</a>
        <img src={state.imgUrl} alt="Error showing image" />
        {Likess}
        {Commentss}
      </div>
    );
  }
}

Post.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Post;
