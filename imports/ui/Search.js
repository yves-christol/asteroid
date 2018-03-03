import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import { Links } from '../api/links.js';

import { Session } from 'meteor/session';

// Link component - represents a single link item
export default class Search extends Component {
  handleChange(event) {
		const search = ReactDOM.findDOMNode(this.refs.searchInput).value.trim();
		Session.set({'searchQuery': search});
  }

  render() {
    return (
      <form className="searchForm" >
        <input className="searchForm"
          type="text"
          ref="searchInput"
          placeholder="Search here"
          onChange={this.handleChange.bind(this)}
        />
      </form>
    );
  }
}
