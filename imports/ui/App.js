import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Links } from '../api/links.js';

import Link from './Link.js';
import Search from './Search.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

// url format tester
function validURL(str) {
  return str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
}

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validURL: false,
      searchText: '',
    };
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
    if (!this.state.validInput || !Meteor.user()) {
      return;
    }
    // Find the text fields via the React ref
    const url = ReactDOM.findDOMNode(this.refs.urlInput).value.trim();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    // check for input consistency

    Meteor.call('links.insert', url, text);

    // Clear form
    ReactDOM.findDOMNode(this.refs.urlInput).value = '';
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
    this.state.validInput = false;
  }

  renderLinks() {
    return this.props.links.map((link) => (
      <
        Link key={link._id}
        link={link}
        owned={
          this.props.currentUser ?
          this.props.currentUser._id == link.owner
          : false
        }
      />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Asteroid</h1>
          <AccountsUIWrapper />
          { this.props.currentUser ?
            <form
              onChange={this.handleChange.bind(this)}
              onSubmit={this.handleSubmit.bind(this)} >
              <input className="linkForm"
                type="text"
                ref="urlInput"
                placeholder="Paste your url here"
              />
              <input className="linkForm"
                type="text"
                ref="textInput"
                placeholder="Type your description here"
              />
              <input className="linkForm"
                type="submit"
                value="Submit"
                disabled={!this.state.validInput}
              />
            </form> : ''
          }
        </header>
        <Search />
        <ul>
          {this.renderLinks()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('links');
  return {
    links: Links.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
})(App);
