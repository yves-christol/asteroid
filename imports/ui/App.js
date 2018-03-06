import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Session } from 'meteor/session';

import { Links } from '../api/links.js';

import Link from './Link.js';
import Search from './Search.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

// clipboard export selected links
function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}


// url format tester
function validURL(str) {
  return str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
}

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validInput: false,
      selectedLinks: [],
    };
    Session.set({'searchText': ''});
    this.selectLink = this.selectLink.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  selectLink(linkId) {
    let selection = this.state.selectedLinks;
    const index = selection.indexOf(linkId);
    if (index > -1) {
      selection = selection.splice(index, 1);
    } else {
      selection.push(linkId);
    }
    this.setState( {selectedLinks: selection});
    console.log(`selection : ${selection}`);
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
    copyToClipboard(`> ${url} - ${text} `);

    // Clear form
    ReactDOM.findDOMNode(this.refs.urlInput).value = '';
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
    this.state.validInput = false;
  }

  renderLinks() {
    return this.props.links.map((link, index) => (
      <
        Link key={link._id}
        link={link}
        odd={index%2 == 1}
        selected={link._id in this.state.selectedLinks}
        owned={
          this.props.currentUser ?
          this.props.currentUser._id == link.owner
          : false
        }
        onSelect={this.selectLink}
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
              onChange={this.handleChange}
              onSubmit={this.handleSubmit} >
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
  Meteor.subscribe('links', Session.get('searchQuery'));
  return {
    links: Links.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
})(App);
