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

const chickens = { "Magda", "Nellie", "John"}
chickens.forEach((chicken) => {
    console.log(chicken);
});

// Map: Examples => transform an Array into another array
const chickens_say = chickens.map((chicken) => (
    '${chicken} says cluck'
));
console.log(chickens_say);

// Object: Examples => iterate over objects
const chickenAges = {
    Magda: 1,
    Nellie: 22,
    John: 21,
};

Object.entries(chickenAges).forEach(([key, value]) => {
    console.log(key, value);
});

function showUsers() {
    const entry = document.getElementById('JSEntry');
    const users = [
        {
            "snippets": [],
            "url": "/api/users/100/",
            "username": "awdeorio"
        },
        {
            "snippets": [],
            "url": "/api/users/200/",
            "username": "jflinn"
        }
    ];
    users.forEach((user) => {
        const n = document.createElement('div');
        const s = '${user.username} has ${user.snippets.length} snippets';
        const t = document.createTextNode('s');
        n.appendChild(t);
        entry.appendChild(n);
    });

    function handleResponse(response) {
        return response.json
    }
    fetch("/api/users/")
        .then(/* handle response and parse JSON */)
        .then(/* handle data and add DOM nodes */)

    // Add a function to process the data parsed from the JSON
    function handleData(data) {
        const users = data.results;
        user.forEach((user) => {
            const node = document.createElement('p');
        })
    }
}

