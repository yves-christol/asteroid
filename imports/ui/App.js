import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import { Links } from '../api/links.js';

import Link from './Link.js';

// url format tester
function validURL(str) {
  return str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
}

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { validURL: false };
  }

  handleChange(event) {
    event.preventDefault();
    // Find the url & text fields via the React ref
    const url = ReactDOM.findDOMNode(this.refs.urlInput).value.trim();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    this.setState({validInput: (text && text.length > 0
                                && url && validURL(url))});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.validInput) {
      return;
    }
    // Find the text field via the React ref
    const url = ReactDOM.findDOMNode(this.refs.urlInput).value.trim();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    // check for input consistency

    Links.insert({
      url,
      text,
      createdAt: new Date(), // current time
    });

    // Clear form
    ReactDOM.findDOMNode(this.refs.urlInput).value = '';
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
    this.state.validInput = false;
  }

  renderLinks() {
    return this.props.links.map((link) => (
      <Link key={link._id} link={link} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Asteroid</h1>
          <form
            onChange={this.handleChange.bind(this)}
            onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="urlInput"
              placeholder="Paste your url here"
            />
            <input
              type="text"
              ref="textInput"
              placeholder="Type your comment here"
            />
            <input
              type="submit"
              value="Submit"
              disabled={!this.state.validInput}
            />
          </form>
        </header>

        <ul>
          {this.renderLinks()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    links: Links.find({}).fetch(),
  };
})(App);
