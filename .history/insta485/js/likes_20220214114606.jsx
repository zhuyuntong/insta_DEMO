import React from "react";
import PropTypes from "prop-types";
import moment from "moment/src/moment";
import InfiniteScroll from "react-infinite-scroll-component";

class Likes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num_links: 0,
      user_like: false,
      comments: [],
      value: undefined,
    };
  }

  componentDidMount() {}
}
