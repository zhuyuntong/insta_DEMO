import React from "react";
import PropTypes from "prop-types";
import moment from "moment/src/moment";
import InfiniteScroll from "react-infinite-scroll-component";

class Posts extends React.Component {
  constructor(props) {
    super(props);
  }
this.state = { imgUrl: "", owner: "" };
}
