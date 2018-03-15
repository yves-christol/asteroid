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
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.deleteThisLink = this.deleteThisLink.bind(this);
    this.addHeart = this.addHeart.bind(this);
  }

  handleSelect(event) {
    this.props.onSelect(this.props.link._id);
  }

  handleEdit(event) {
    this.props.onEdit(this.props.link.url, this.props.link.text);
  }

  addHeart() {
    Meteor.call('links.addHeart', this.props.link._id);
  }

  deleteThisLink() {
    Meteor.call('links.remove', this.props.link._id);
  }

  render() {
    // Give links a different className when they are marked,
    // so that we can style them nicely in CSS
    const linkClassName = this.props.selected ?
                          'marked' : this.props.odd ? 'odd' : '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = this.props.link.createdAt.toLocaleDateString("en-US", options);

    return (
      <li className={linkClassName}>
        <button className="hearts" onClick={this.addHeart}>
          {this.props.link.hearts}
          <GoHeart />
        </button>
        { this.props.owned ?
          <button className="manage" onClick={this.deleteThisLink}>
            <GoTrashcan />
          </button>  : ''
        }
        { this.props.owned ?
          <button className="manage" onClick={this.handleEdit}>
            <GoPencil />
          </button> : ''
        }
        <input
          type="checkbox"
          readOnly
          checked={this.props.selected}
          onClick={this.handleSelect}
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
          on the
          { ` ${date}.`}
        </span>
      </li>
    );
  }
}
