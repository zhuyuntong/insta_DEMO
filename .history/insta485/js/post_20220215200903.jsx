/* eslint-disable quotes */
import React from "react";
import PropTypes from "prop-types";
import moment from "moment/moment.js";
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

    //  this.handleDoubleClick = this.handleDoubleClick.bind(this);
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

  // handleDoubleClick() {
  //   let clickTime = 0;

  //   const handleClick = (e) => {
  //     if (clickTime === 0) {
  //       clickTime = new Date().getTime();
  //     } else {
  //       if (new Date().getTime() - clickTime < 800) {
  //         // reset time
  //         clickTime = 0;
  //         // This line automatically assigns this.props.url to the const variable url
  //         const { link } = this.props;

  //         let temppostid;

  //         // Call REST API to get the post's information
  //         fetch(link, { credentials: "same-origin" })
  //           .then((response) => {
  //             if (!response.ok) throw Error(response.statusText);
  //             return response.json();
  //           })
  //           .then((data) => {
  //             temppostid = data.postid;
  //             this.setState({
  //               created: data.created,
  //               imgUrl: data.imgUrl,
  //               owner: data.owner,
  //               ownerImgUrl: data.ownerImgUrl,
  //               ownerShowUrl: data.ownerShowUrl,
  //               postShowUrl: data.postShowUrl,
  //             });
  //           })
  //           .catch((error) => console.log(error));

  //         newurl = "/api/v1/likes/?postid=";
  //         newurl = newurl.concat(toString(temppostid));

  //         fetch(newurl, {
  //           method,
  //           credentials: "same-origin",
  //           // body: JSON.stringify('')
  //         })
  //           .then((response) => {
  //             if (!response.ok) throw Error(response.statusText);
  //             return response.json();
  //           })
  //           .then((data) => {
  //             this.setState({
  //               url: data.url,
  //             });
  //           });
  //       } else {
  //         // regain current timestamp
  //         clickTime = new Date().getTime();
  //       }
  //     }
  //   };
  // }

  render() {
    // This line automatically assigns this.state.imgUrl to the const variable imgUrl
    // and this.state.owner to the const variable owner

    const momentcreated = moment(this.state.created).fromNow();
    const Likess = <Likes link={this.props.link} />;
    const Commentss = <Comments link={this.props.link} />;
    // Render number of post image and post owner
    return (
      <div className="SAINT-AVA">
        <img
          src={this.state.ownerImgUrl}
          alt={this.state.owner}
          style={{ width: "20px", height: "20px" }}
        />
        <a href={this.state.ownerShowUrl}>{this.state.owner}</a>
        <a href={this.state.postShowUrl}>{momentcreated}</a>
        <button>
          <img
            src={this.state.imgUrl}
            alt="Error"
            onClick={this.onDoubleClick}
          />
        </button>
        {Likess}
        {Commentss}
      </div>
    );
  }
}

Post.propTypes = {
  link: PropTypes.string.isRequired,
};

export default Post;

/* .......REFERENCE..........*/

// function DoubleClickHeart() {
//   let clickTime = 0;

//   const handleClick = (e) => {
//     if (clickTime === 0) {
//       clickTime = new Date().getTime();
//     } else {
//       if (new Date().getTime() - clickTime < 800) {
//         // reset time
//         clickTime = 0;
//         // This line automatically assigns this.props.url to the const variable url
//         const { link } = this.props;

//         let temppostid;

//         // Call REST API to get the post's information
//         fetch(link, { credentials: "same-origin" })
//           .then((response) => {
//             if (!response.ok) throw Error(response.statusText);
//             return response.json();
//           })
//           .then((data) => {
//             temppostid = data.postid;
//             this.setState({
//               created: data.created,
//               imgUrl: data.imgUrl,
//               owner: data.owner,
//               ownerImgUrl: data.ownerImgUrl,
//               ownerShowUrl: data.ownerShowUrl,
//               postShowUrl: data.postShowUrl,
//             });
//           })
//           .catch((error) => console.log(error));

//         newurl = "/api/v1/likes/?postid=";
//         newurl = newurl.concat(toString(temppostid));

//         fetch(newurl, {
//           method,
//           credentials: "same-origin",
//           // body: JSON.stringify('')
//         })
//           .then((response) => {
//             if (!response.ok) throw Error(response.statusText);
//             return response.json();
//           })
//           .then((data) => {
//             this.setState({
//               url: data.url,
//             });
//           });
//       } else {
//         // regain current timestamp
//         clickTime = new Date().getTime();
//       }
//     }
//   };
// }

// // export default DoubleClickHeart;

// // setTimeout(() => { React.unmountComponentAtNode(document.getElementById("container")) },800);
