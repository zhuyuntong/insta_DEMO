import React from "react";
import ReactDOM from "react-dom";
import Post from "./post";
// This method is only called once

ReactDOM.render(
  // Insert the post component into the DOM
  <Post url="/api/v1/posts/1/" />,
  document.getElementById("1")
);
