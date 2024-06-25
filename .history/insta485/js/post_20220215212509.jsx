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
      // likes
      total_likes: 0,
      logname_likes: false,
      url: "",
      postid: -1,
    };

    this.handleDoubleClick = this.handleDoubleClick.bind(this);
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
          // comment
          created: data.created,
          imgUrl: data.imgUrl,
          owner: data.owner,
          ownerImgUrl: data.ownerImgUrl,
          ownerShowUrl: data.ownerShowUrl,
          postShowUrl: data.postShowUrl,
          // likes
          logname_likes: data.lognameLikesThis,
          total_likes: data.numLikes,
          url: data.url,
        });
      })
      .catch((error) => console.log(error));
  }

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

  render() {
    // This line automatically assigns this.state.imgUrl to the const variable imgUrl
    // and this.state.owner to the const variable owner

    const momentcreated = moment(this.state.created).fromNow();
    const Likess = (
      <Likes
        link={this.props.link}
        logname_likes={this.state.logname_likes}
        total_likes={this.state.total_likes}
        url={this.state.url}
        onChangeLikeState={this.handleClick}
      />
    );
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
            onDoubleClick={handleDoubleClick}
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
