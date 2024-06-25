/* eslint-disable quotes */
import React from "react";
import PropTypes from "prop-types";

class Comment extends React.Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      // commentid: this.props.commentid,
      // lognameOwnsThis: false,
      // owner: "",
      // ownerShowUrl: "",
      // text: "",
      // url: "",
    };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { link } = this.props;

    let index = this.props.index;

    fetch(link, { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        this.setState({
          // lognameOwnsThis: data[index].lognameOwnsThis,
          // owner: data[index].owner,
          // ownerShowUrl: data[index].ownerShowUrl,
          // text: data[index].text,
          // url: data[index].url,
        });
      })
      .catch((error) => console.log(error));
  }

  handleClick() {
    let deleteurl = this.state.url;

    fetch(deleteurl, {
      credentials: "same-origin",
      // body: JSON.stringify('')
    });
  }

  render() {
    // FIXME: DELETE COMMENT BUTTON for logged-in users
    let button;
    if (this.state.logname_likes === true) {
      button = (
        <button
          type="button"
          className="delete-comment-button"
          onClick={this.handleClick}
        >
          delete
        </button>
      );
    }

    return (
      <div className="SAINT-EILEEN">
        <a href={this.state.ownerShowUrl}>{this.state.owner}</a>{" "}
        {this.state.text}
        {this.state.lognameOwnsThis ? button : ""};
      </div>
    );
  }
}

export default Comment;
