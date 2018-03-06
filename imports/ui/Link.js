import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { Links } from '../api/links.js';

// Icon selection from https://octicons.github.com/icon
import GoHeart from 'react-icons/lib/go/heart';
import GoLink from 'react-icons/lib/go/link';
import GoClippy from 'react-icons/lib/go/clippy';
import GoPencil from 'react-icons/lib/go/pencil';
import GoTrashcan from 'react-icons/lib/go/trashcan';


// Link component - represents a single link item
export default class Link extends Component {

  handleSelect(event) {
    this.props.onSelect(this.props.link._id);
  }

  deleteThisLink() {
    Meteor.call('links.remove', this.props.link._id);
  }

  render() {
    // Give links a different className when they are marked,
    // so that we can style them nicely in CSS
    const linkClassName = this.props.link.marked ?
                          'marked' : this.props.odd ? 'odd' : '';

    return (
      <li className={linkClassName}>
        { this.props.owned ? '' :
          <button className="manage" >
            <GoHeart />
          </button>
        }
        { this.props.owned ?
          <button className="manage" onClick={this.deleteThisLink.bind(this)}>
            <GoTrashcan />
          </button>  : ''
        }
        { this.props.owned ?
          <button className="manage">
            <GoPencil />
          </button> : ''
        }
        <input
          type="checkbox"
          readOnly
          checked={this.props.selected}
          onClick={this.handleSelect.bind(this)}
        />
        <span className="text">
          <a target="_blank" href={this.props.link.url}>
            {this.props.link.text}
          </a>
        </span>
        <span className="sender">
          <GoLink />
          posted by
          { this.props.owned ? ' me.' : ` ${this.props.link.username}.`}
        </span>
      </li>
    );
  }
}
