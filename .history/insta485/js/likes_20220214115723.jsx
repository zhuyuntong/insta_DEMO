/* eslint-disable quotes */
import React from "react";
import PropTypes from "prop-types";

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
