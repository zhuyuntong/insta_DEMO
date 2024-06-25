/* eslint-disable quotes */
import React from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./post";
// Newly added

class Posts extends React.Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      next: "",
      totalposts: [],
    };

    this.fetchData = this.fetchData.bind(this);
  }

  fetchData() {
    fetch(this.state.next, { credentials: "same-origin" })
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

  componentDidMount() {
    // Call REST API to get number of likes
    fetch(this.props.link, { credentials: "same-origin" })
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

  render() {
    const posts = [];
    for (const [index, post] of this.state.results.entries()) {
      posts.push(<Post url={post.url} postid={post.postid} key={index} />);
    }

    return (
      <div className="container">
        <InfiniteScroll
          dataLength={posts.length} //This is important field to render the next data
          next={this.fetchData}
          hasMore={this.state.next !== ""}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          // below props only if you need pull down functionality
          // refreshFunction={this.refresh}
          // pullDownToRefresh
          // pullDownToRefreshContent={
          //   <h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>
          // }
          // releaseToRefreshContent={
          //   <h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>
          // }
        >
          {posts}
        </InfiniteScroll>
      </div>
    );
  }
}

Posts.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Posts;
