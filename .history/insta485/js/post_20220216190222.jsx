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
      //comments
      comments: [],
      value: "",
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    // Comments props
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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
          logname_likes: data.likes.lognameLikesThis,
          total_likes: data.likes.numLikes,
          url: data.likes.url,
          // likes
          postid: data.postid,
          //comments
          comments: data.comments,
        });
      })
      .catch((error) => console.log(error));
  }

  handleClick() {
    // let temp = this.state.total_likes;
    const { postid } = this.state;
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
      newurl = newurl.concat(postid);
    }

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
      });
      this.setState({
        url: "",
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

  handleDoubleClick() {
    // This line automatically assigns this.props.url to the const variable url
    const { link } = this.props;
    const { postid } = this.state;

    let newurl = "/api/v1/likes/?postid=";
    newurl = newurl.concat(postid);

    fetch(newurl, {
      method: "POST",
      credentials: "same-origin",
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

  handleChange(value) {
    this.setState({ value });
  }

  handleSubmit() {
    event.preventDefault();
    const { postid } = this.state;
    const { value } = this.state;
    let newurl = "/api/v1/comments/?postid=";
    newurl = newurl.concat(postid);

    fetch(newurl, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: value }),
    })
      .then((response) => {
        if (!response.status === 201) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        this.setState((state) => ({
          comments: state.comments.concat([data]),
        }));
      })
      .catch((error) => console.log(error));

    this.setState({
      value: "",
    });
  }

  handleDelete(value) {
    const { link } = this.props;

    let deleteurl = "/api/v1/comments/";
    deleteurl = deleteurl.concat(value);
    deleteurl = deleteurl.concat("/");
    fetch(deleteurl, {
      method: "DELETE",
      credentials: "same-origin",
    }).then((response) => {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    });

    fetch(link, { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log(data.comments);
        this.setState({
          comments: data.comments,
        });
      })
      .catch((error) => console.log(error));
  }

  render() {
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
    const Commentss = (
      <Comments
        link={this.props.link}
        postid={this.state.postid}
        comments={this.state.comments}
        value={this.state.value}
        onChangeCommentState={this.handleChange}
        onChangeCommentSubmit={this.handleSubmit}
        onChangeCommentDelete={this.handleDelete}
      />
    );
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
            onDoubleClick={this.handleDoubleClick}
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
