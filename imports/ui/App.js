import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import { Links } from '../api/links.js';

import Link from './Link.js';

// App component - represents the whole app
class App extends Component {
  handleSubmit(event) {
    event.preventDefault();
    console.log("Toto");
    // Find the text field via the React ref
    const url = ReactDOM.findDOMNode(this.refs.urlInput).value.trim();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Links.insert({
      url,
      text,
      createdAt: new Date(), // current time
    });

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
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
          <form className="new-link" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="url"
              ref="urlInput"
              placeholder="Paste your url here"
            />
            <input
              type="text"
              ref="textInput"
              placeholder="Type your description"
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
