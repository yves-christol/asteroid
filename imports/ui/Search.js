import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import { Links } from '../api/links.js';

import { Session } from 'meteor/session';

//import GoSearch from 'react-icons/lib/go/search';
import GoClippy from 'react-icons/lib/go/clippy';


// Link component - represents a single link item
export default class Search extends Component {
  handleChange(event) {
		const search = ReactDOM.findDOMNode(this.refs.searchInput).value.trim();
		Session.set({'searchQuery': search});
  }

  render() {
    return (
      <div className='searchBar'>
        <div>
          <button className='clipboardButton'>
            <GoClippy />
          </button>
        </div>
        <div>
          <select className='searchSort'>
            <option className='searchSortItem' value="date">By date</option>
            <option className='searchSortItem' value="liked">Most liked</option>
            <option className='searchSortItem' value="sender">By sender</option>
          </select>
        </div>
        <div>
          <input className='searchForm'
            type='text'
            ref='searchInput'
            placeholder='Search here'
            onChange={this.handleChange.bind(this)}
          />
        </div>
      </div>
    );
  }
}
