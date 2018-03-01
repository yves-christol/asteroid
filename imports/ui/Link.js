import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { Links } from '../api/links.js';


// Link component - represents a single link item
export default class Link extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // doesn't work
      owned: Meteor.call('links.isOwned', this.props.link._id),
    };
  }

  toggleMarked() {
    // Set the marked property to the opposite of its current value
    Meteor.call('links.setMarked', this.props.link._id, !this.props.link.marked);
  }

  deleteThisLink() {
    Meteor.call('links.remove', this.props.link._id);
  }

  render() {
    // Give links a different className when they are marked,
    // so that we can style them nicely in CSS
    const linkClassName = this.props.link.marked ? 'marked' : '';

    return (
      <li className={linkClassName}>
        { this.state.owned ?
          <button className="delete"
          onClick={this.deleteThisLink.bind(this)}>
          &times;
          </button> : ''
        }
        <input
          type="checkbox"
          readOnly
          checked={!!this.props.link.marked}
          onClick={this.toggleMarked.bind(this)}
        />
        <span className="text">
          <a target="_blank" href={this.props.link.url}>
            {this.props.link.url}
          </a>
          _{this.props.link.text}_
          <small>_from {this.props.link.username}</small>
        </span>
      </li>
    );
  }
}
