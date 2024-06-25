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

  render() {
    const postss = [];
    this.state.totalposts.entries().forEach((val, post) => {
      postss.push(<Post link={post.url} key={val} />);
    });
    return (
      <div className="SAINT-CAROL">
        <p>uasdhfouadshofuadshofu</p>
        {/* <InfiniteScroll
          dataLength={postss.length}
          next={this.fetchData}
          hasMore={this.state.next}
          loader={<h4>Loading...</h4>}
        >
          {postss}
        </InfiniteScroll> */}
      </div>
    );
  }
}

Posts.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Posts;
