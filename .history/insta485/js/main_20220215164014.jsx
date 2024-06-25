/* eslint-disable quotes */
import React from "react";
import ReactDOM from "react-dom";
import Posts from "./posts";

// This method is only called once

const hi = <p>qeowfjwqipoefj</p>;
ReactDOM.render(
  // Insert the post component into the DOM
  <Posts link="/api/v1/posts/" />,

  document.getElementById("reactEntry"),
);

// end of file
