import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Session } from 'meteor/session';

import { Links } from '../api/links.js';

import Link from './Link.js';
import Search from './Search.js';
import Foot from './Foot.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

// max number of links displaid
const limitValues = [10, 20, 50, 100];

// url format tester
function validURL(str) {
  return str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
}

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoMode: false,
      validInput: false,
      selectedLinks: [],
    };
    this.text = '';
    Session.set({'searchText': ''});
    Session.set({'searchSortBy': 'createdAt'});
    Session.set({'searchOrder': -1});
    Session.set({'searchLimit': 0});
    this.selectLink = this.selectLink.bind(this);
    this.editLink = this.editLink.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.changeSortBy = this.changeSortBy.bind(this);
    this.changeSortOrder = this.changeSortOrder.bind(this);
    this.moreLinks = this.moreLinks.bind(this);
    this.lessLinks = this.lessLinks.bind(this);
    this.switchInfo = this.switchInfo.bind(this);
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

  changeSortBy(event) {
    switch (Session.get('searchSortBy')) {
      case 'createdAt':
        Session.set({'searchSortBy': 'username'});
        break;
      case 'username':
        Session.set({'searchSortBy': 'hearts'});
        break;
      default :
        Session.set({'searchSortBy': 'createdAt'});
        break;
    }
  }

  changeSortOrder(event) {
    Session.set({'searchOrder': (Session.get('searchOrder') == 1) ? -1 : 1});
  }

  moreLinks(event) {
    const limitIdx = Session.get('searchLimit');
    if (limitIdx < limitValues.length) {
      Session.set({'searchLimit': limitIdx + 1})
    }
  }

  lessLinks(event) {
    const limitIdx = Session.get('searchLimit');
    if (limitIdx > 0) {
      Session.set({'searchLimit': limitIdx - 1})
    }
  }

  switchInfo(event) {
    this.setState({infoMode: !this.state.infoMode});
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

  editLink(url, text) {
    ReactDOM.findDOMNode(this.refs.urlInput).value = url;
    ReactDOM.findDOMNode(this.refs.textInput).value = text;
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
        onEdit={this.editLink}
      />
    ));
  }

  renderInfo() {
    return (
      <ul className='info'>
      This is a personal website to manage curated links and share them easily
      thanks to search, select and copy to clipboard features. It is not a
      commercial nor a waranted in any form service, but just a toy made
      to learn some <a href='http://www.meteor.com'> Meteor </a> and some
      <a href='http://reactjs.org'> React</a> basics. Feel free to fork the
      code <a href='https://github.com/yves-christol/asteroid'> here</a>.
      Thank you for visiting.
      </ul>
    )
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
          sortBy={Session.get('searchSortBy')}
          changeSortBy={this.changeSortBy}
          order={Session.get('searchOrder')}
          changeSortOrder={this.changeSortOrder}
        />
        <ul>
          {this.state.infoMode ? this.renderInfo() : this.renderLinks()}
        </ul>
        <Foot
          count={Links.find().count()}
          total={this.props.total}
          limitIdx={Session.get('searchLimit')}
          maxLimitIdx={limitValues.length - 1}
          moreLinks={this.moreLinks}
          lessLinks={this.lessLinks}
          info={this.state.infoMode}
          switchInfo={this.switchInfo}
        />
      </div>
    );
  }
}

export default withTracker(() => {
  const search = Session.get('searchQuery'),
        sortBy = Session.get('searchSortBy'),
        order = Session.get('searchOrder'),
        limit = limitValues[Session.get('searchLimit')];
  Meteor.subscribe('links', search, sortBy, order, limit);
  Meteor.subscribe('counters');
  return {
    links: Links.find({}, {sort : { [sortBy]: order }}).fetch(),
    currentUser: Meteor.user(),
    total: Counts.get('nbLinks'),
  };
})(App);
