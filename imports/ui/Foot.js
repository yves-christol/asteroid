import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import { Links } from '../api/links.js';

import { Session } from 'meteor/session';

import GoLink from 'react-icons/lib/go/link';
import GoMore from 'react-icons/lib/go/diff-added';
import GoLess from 'react-icons/lib/go/diff-removed';
import GoInfo from 'react-icons/lib/go/info';

// Foot line
export default class Foot extends Component {
  render() {
    return (
      <div className='footBar'>
        <div className='footText'>
          {this.props.count} <GoLink /> out of {this.props.total}
        </div>
        <div>
          <button
            className='footButton'
            disabled={this.props.limitIdx == 0}
            onClick={this.props.lessLinks}
          >
            <GoLess />
          </button>

          <button
            className='footButton'
            disabled={this.props.limitIdx == this.props.maxLimitIdx}
            onClick={this.props.moreLinks}
          >
            <GoMore />
          </button>
        </div>
        <div>
          <button
            className={this.props.info ? 'footInfoOn' : 'footInfoOff'}
            onClick={this.props.switchInfo}
          >
            <GoInfo />
          </button>
        </div>
      </div>
    );
  }
}
