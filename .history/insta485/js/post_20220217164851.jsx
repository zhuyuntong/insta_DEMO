import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import Likes from './likes';
import Comments from './comments';
// Newly added
// import InfiniteScroll from "react-infinite-scroll-component";

class Post extends React.Component {
  /* Display number of image and post owner of a single post
   */

  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      created: '',
      imgUrl: '',
      owner: '',
      ownerImgUrl: '',
      ownerShowUrl: '',
      postShowUrl: '',
      // likes
      total_likes: 0,
      logname_likes: false,
      url: '',
      postid: -1,
      // comments
      comments: [],
      value: '',
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
    fetch(link, { credentials: 'same-origin' })
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
          // comments
          comments: data.comments,
        });
      })
      .catch((error) => console.log(error));
  }

  handleClick() {
    // let temp = this.state.total_likes;
    const { logname_likes } = this.state;
    const { postid } = this.state;
    const { url } = this.state;
    let method;
    if (logname_likes === true) {
      method = 'DELETE';
    } else if (logname_likes === false) {
      method = 'POST';
    }
    let newurl;
    if (method === 'DELETE') {
      newurl = url;
    } else if (method === 'POST') {
      newurl = '/api/v1/likes/?postid=';
      newurl = newurl.concat(postid);
    }

    if (method === 'POST') {
      fetch(newurl, {
        method,
        credentials: 'same-origin',
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
        credentials: 'same-origin',
      });
      this.setState({
        url: '',
      });
    }
    let addone = 1;
    if (logname_likes === true) {
      addone = -1;
    }
    this.setState((state) => ({
      total_likes: state.total_likes + addone,
      logname_likes: !state.logname_likes,
    }));
  }

  handleDoubleClick() {
    // This line automatically assigns this.props.url to the const variable url
    const { postid } = this.state;
    const { logname_likes } = this.state;
    let newurl = '/api/v1/likes/?postid=';
    newurl = newurl.concat(postid);
    if (logname_likes !== true) {
      fetch(newurl, {
        method: 'POST',
        credentials: 'same-origin',
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
  }

  handleChange(value) {
    // event.preventDefault();
    this.setState({ value });
  }

  handleSubmit() {
    // event.preventDefault();
    const { postid } = this.state;
    const { value } = this.state;
    let newurl = '/api/v1/comments/?postid=';
    newurl = newurl.concat(postid);

    fetch(newurl, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
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
      value: '',
    });
  }

  handleDelete(value) {
    // event.preventDefault();
    const { comments } = this.state;
    let deleteurl = '/api/v1/comments/';
    deleteurl = deleteurl.concat(value);
    deleteurl = deleteurl.concat('/');

    fetch(deleteurl, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    const tempcomments = comments;
    let index = 0;
    for (let i = 0; i < tempcomments.length; i += 1) {
      if (tempcomments[i].commentid === parseInt(value, 10)) {
        tempcomments.splice(index, 1);
      }
      index += 1;
    }
    this.setState({
      comments: tempcomments,
    });
    // }).then((response) => {
    //     fetch(link, { credentials: "same-origin" })
    //     .then((response) => {
    //       if (!response.ok) throw Error(response.statusText);
    //       return response.json();
    //     })
    //     .then((data) => {
    //       console.log(data.comments);
    //       this.setState({
    //         comments: data.comments,
    //       });
    //     })
    //     .catch((error) => console.log(error));
    // });

    // fetch(link, { credentials: "same-origin" })
    //   .then((response) => {
    //     if (!response.ok) throw Error(response.statusText);
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log(data.comments);
    //     this.setState({
    //       comments: data.comments,
    //     });
    //   })
    //   .catch((error) => console.log(error));
  }

  render() {
    const { created } = this.state;
    const { link } = this.props;
    const { logname_likes } = this.state;
    const { total_likes } = this.state;
    const { url } = this.state;
    const { postid } = this.state;
    const { comments } = this.state;
    const { value } = this.state;
    const { ownerImgUrl } = this.state;
    const { owner } = this.state;
    const { ownerShowUrl } = this.state;
    const { postShowUrl } = this.state;
    const { imgUrl } = this.state;
    const momentcreated = moment(created).fromNow();

    const Likess = (
      <Likes
        link={link}
        logname_likes={logname_likes}
        total_likes={total_likes}
        url={url}
        onChangeLikeState={this.handleClick}
      />
    );
    const Commentss = (
      <Comments
        link={this.props.link}
        postid={postid}
        comments={comments}
        value={value}
        onChangeCommentState={this.handleChange}
        onChangeCommentSubmit={this.handleSubmit}
        onChangeCommentDelete={this.handleDelete}
      />
    );
    // Render number of post image and post owner
    return (
      <div className="SAINT-AVA">
        <img
          src={ownerImgUrl}
          alt={owner}
          style={{ width: '20px', height: '20px' }}
        />
        <a href={ownerShowUrl}>{owner}</a>
        <a href={postShowUrl}>{momentcreated}</a>

        <button type="button">
          <img
            src={imgUrl}
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

/* .......REFERENCE.......... */

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
