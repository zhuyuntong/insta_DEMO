import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from './post';
// Newly added

class Posts extends React.Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      next: '',
      totalposts: [],
      // //post
      // created: "",
      // imgUrl: "",
      // owner: "",
      // ownerImgUrl: "",
      // ownerShowUrl: "",
      // postShowUrl: "",
      // //like
      // total_likes: 0,
      // logname_likes: false,
      // url: "",
      // postid: -1,
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    // Call REST API to get number of likes
    const { link } = this.props;

    fetch(link, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        this.setState({
          next: data.next,
          totalposts: data.results,
        });
      })
      .catch((error) => console.log(error));
  }

  fetchData() {
    const { next } = this.state;
    fetch(next, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        this.setState((state) => ({
          next: data.next,
          totalposts: state.totalposts.concat(data.results),
        }));
      })
      .catch((error) => console.log(error));
  }

  // handleClick() {
  //   // let change = this.state.logname_likes ? -1 : 1;
  //   // let temp = this.state.total_likes;
  //   // const { link } = this.props;

  //   let method;
  //   if (this.setState.logname_likes === true) {
  //     method = "DELETE";
  //   } else if (this.setState.logname_likes === false) {
  //     method = "POST";
  //   }
  //   let newurl;
  //   if (method === "DELETE") {
  //     newurl = this.setState.url;
  //   } else if (method === "POST") {
  //     newurl = "/api/v1/likes/?postid=";
  //     newurl = newurl.concat(toString(this.setState.postid));
  //   }

  //   // = this.state.logname_likes ? "DELETE" : "POST";
  //   if (method === "POST") {
  //     fetch(newurl, {
  //       method,
  //       credentials: "same-origin",
  //       // body: JSON.stringify('')
  //     })
  //       .then((response) => {
  //         if (!response.ok) throw Error(response.statusText);
  //         return response.json();
  //       })
  //       .then((data) => {
  //         this.setState({
  //           url: data.url,
  //         });
  //       });
  //   } else {
  //     fetch(newurl, {
  //       method,
  //       credentials: "same-origin",
  //       // body: JSON.stringify('')
  //     });
  //     this.setState({
  //       url: "",
  //     });
  //   }
  //   let addone = 1;
  //   if (this.props.logname_likes === true) {
  //     addone = -1;
  //   }
  // }

  // handleDoubleClick() {
  //   // This line automatically assigns this.props.url to the const variable url
  //   const { link } = this.props;

  //   newurl = "/api/v1/likes/?postid=";
  //   newurl = newurl.concat(toString(this.state.postid));

  //   fetch(newurl, {
  //     method,
  //     credentials: "same-origin",
  //     // body: JSON.stringify('')
  //   })
  //     .then((response) => {
  //       if (response.status === 201) {
  //         this.setState((state) => ({
  //           total_likes: state.total_likes + 1,
  //           logname_likes: !state.logname_likes,
  //         }));
  //       }
  //       if (!response.ok) throw Error(response.statusText);
  //       return response.json();
  //     })
  //     .then((data) => {
  //       this.setState({
  //         url: data.url,
  //       });
  //     });
  // }

  render() {
    const postss = [];
    // this.state.totalposts.entries().forEach((val, post) => {
    const { totalposts } = this.state;
    const { next } = this.state;
    // console.log(typeof (totalposts.entries()));
    // for (const [val, post] of totalposts.entries()) {
    //   postss.push(<Post link={post.url} key={val} />);
    // }
    totalposts.entries();
    return (
      <div className="SAINT-CAROL">
        <InfiniteScroll
          dataLength={postss.length}
          next={this.fetchData}
          hasMore={next}
          loader={<h4>Loading...</h4>}
        >
          {postss}
        </InfiniteScroll>
      </div>
    );
  }
}

Posts.propTypes = {
  link: PropTypes.string.isRequired,
};

export default Posts;
