import React from 'react';
import ReactDOM from 'react-dom';
import Posts from './posts';

// This method is only called once

ReactDOM.render(
  // Insert the post component into the DOM
  <Posts link="http://localhost:3000api/v1/posts/' />,
  document.getElementById('reactEntry'),
);

// end of file
