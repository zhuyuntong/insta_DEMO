import React from "react";
import ReactDOM from "react-dom";
import Post from "./post";

Let: myh1 = React.createElement("h1", null, "mdfker");
a = 1;
title = "hello";
ReactDOM.render(
  <Post url="/api/v1/posts/1/" />,
  <div>
    {a}, {myh1}, <p> {title} </p> <span> {title} </span>,
  </div>
document.getElementById("reactEntry")
);
