import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import { Links } from '../api/links.js';

import { Session } from 'meteor/session';

import GoSearch from 'react-icons/lib/go/search';
import GoClippy from 'react-icons/lib/go/clippy';
import GoCalendar from 'react-icons/lib/go/calendar';
import GoArrowDown from 'react-icons/lib/go/arrow-down';
import GoArrowUp from 'react-icons/lib/go/arrow-up';
import GoPerson from 'react-icons/lib/go/person';
import GoHeart from 'react-icons/lib/go/heart';


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
          <button
            className='clipboardButton'
            disabled={this.props.clipboardIsEmpty}
            onClick={this.props.handleClipboard}
          >
            <GoClippy />
          </button>
        </div>
        <div>
          <button
            className='searchSort'
            onClick={this.props.changeSortBy}
          >
            { Session.get('searchSortBy')=='createdAt' ?
              <GoCalendar /> : Session.get('searchSortBy')=='username' ?
              <GoPerson /> :
              <GoHeart />
            }
          </button>
        </div>
        <div>
          <button
            className='searchSort'
            onClick={this.props.changeSortOrder}
          >
           {(Session.get('searchOrder') == 1) ? <GoArrowDown /> : <GoArrowUp />}
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
