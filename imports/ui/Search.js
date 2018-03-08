import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import { Links } from '../api/links.js';

import { Session } from 'meteor/session';

import GoSearch from 'react-icons/lib/go/search';
import GoClippy from 'react-icons/lib/go/clippy';
import GoCalendar from 'react-icons/lib/go/calendar';
import GoArrowDown from 'react-icons/lib/go/arrow-down';


// Link component - represents a single link item
export default class Search extends Component {
  handleChange(event) {
		const search = ReactDOM.findDOMNode(this.refs.searchInput).value.trim();
		Session.set({'searchQuery': search});
  }

  handleClick(event) {
    this.props.handleClipboard();
  }

  render() {
    return (
      <div className='searchBar'>
        <div>
          <button
            className='clipboardButton'
            disabled={this.props.clipboardIsEmpty}
            onClick={this.handleClick.bind(this)}
          >
            <GoClippy />
          </button>
        </div>
        <div>
          <button
            className='searchSort'
            onClick={this.handleClick.bind(this)}
          >
           <GoCalendar />
          </button>
        </div>
        <div>
          <button
            className='searchSort'
            onClick={this.handleClick.bind(this)}
          >
           <GoArrowDown />
          </button>
        </div>
        <div>
          <GoSearch className='searchIcon'/>
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
