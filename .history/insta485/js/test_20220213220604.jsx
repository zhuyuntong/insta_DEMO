/* eslint-disable quotes */
/* eslint-disable react/jsx-indent */
import React from "react";
import ReactDOM from "react-dom";
import Post from "./post";

// myh1 = React.createElement("h1", null, "mdfker");
// a = 1;
// title = "hello";

// // TODO: fixme
// class ComponentOne extends React.Component {
//   componentWillUnmount() {
//     Alert("The component is going to be unmounted");
//   }
//   render() {
//     return <h1>Hello Geeks!</h1>;
//   }
// }

// ReactDOM.render(
//   <Post url="/api/v1/posts/1/" />,
//   <div>
//     {a}, {myh1}, <p> {title} </p> <span> {title} </span>,
//     </div>,
//       // TODO: fixme
//     if (this.state.display) {
//       comp = <ComponentOne />;
//     }
//   document.getElementById("reactEntry")
// );

// TODO: Examples In CLASS
<button onClick="hello()" type="button">
  CLICK ME!
</button>;

function callback1() {
  console.log("this is a msg from callback1");
}
setTimeout(callback1, 1000);

function f() {
  console.log("beginning");
  function callback2() {
    console.log("msg from callback2");
  }
  setTimeout(callback2, 2000);
  console.log("end of callbacks");
}

const chickens = { "Magda", "Nellie', 'John'};
chickens.forEach((chicken) => {
    console.log(chicken);
});

const chickens_say = chickens.map((chicken) => (
    '${chicken} says cluck'
));