import React, { Component } from 'react';
import { Links } from '../api/links.js';


// Task component - represents a single todo item
export default class Link extends Component {
  toggleMarked() {
    // Set the checked property to the opposite of its current value
    Links.update(this.props.link._id, {
      $set: { marked: !this.props.link.marked },
    });
  }

  deleteThisLink() {
    Links.remove(this.props.link._id);
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const linkClassName = this.props.link.marked ? 'marked' : '';

    return (
      <li className={linkClassName}>
        <button className="delete" onClick={this.deleteThisLink.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={!!this.props.link.marked}
          onClick={this.toggleMarked.bind(this)}
        />
        <span className="text">
          <a target="_blank" href={this.props.link.url}>
            {this.props.link.text}
          </a>
          : from <strong>{this.props.link.username}</strong>
        </span>
      </li>
    );
  }
}
