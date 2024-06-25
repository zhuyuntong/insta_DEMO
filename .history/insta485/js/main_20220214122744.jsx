/* eslint-disable quotes */
import React from "react";
import ReactDOM from "react-dom";
import Post from "./post";
import Likes from "./likes";
// This method is only called once

ReactDOM.render(
  // Insert the post component into the DOM
  <Post url="/api/v1/posts/" />,
  document.getElementById("reactEntry"),
);

// end of file
