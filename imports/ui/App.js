import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Session } from 'meteor/session';

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
      validInput: false,
      selectedLinks: [],
    };
    this.text = '';
    Session.set({'searchText': ''});
    this.selectLink = this.selectLink.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
  }

  // clipboard export selected links
  copyToClipboard() {
    const textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = this.text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.log(`Copying text command was ${msg}`);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
    this.setState({selectedLinks : []});
  }

  selectLink(linkId) {
    let sel = this.state.selectedLinks;
    const index = sel.indexOf(linkId);
    if (index !== -1) {
      sel.splice(index, 1);
    } else {
      sel.push(linkId);
    }
    this.setState({selectedLinks: sel});
    Meteor.call('links.getText', this.state.selectedLinks, (error, result) => this.text = result);
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
      < Link
        key={link._id}
        link={link}
        odd={index % 2 == 1}
        owned={
          this.props.currentUser ?
          this.props.currentUser._id == link.owner
          : false
        }
        selected={this.state.selectedLinks.indexOf(link._id) !== -1}
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
        <Search
          clipboardIsEmpty={this.state.selectedLinks.length == 0}
          handleClipboard={this.copyToClipboard}
        />
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
