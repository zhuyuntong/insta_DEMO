/* eslint-disable quotes */
import React from "react";
import ReactDOM from "react-dom";
import Post from "./post";

// This method is only called once

ReactDOM.render(
  // Insert the post component into the DOM
  <Post link="/api/v1/posts/" />,
  document.getElementById("reactEntry"),
);

// end of file
