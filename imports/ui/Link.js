import React, { Component } from 'react';

// Task component - represents a single todo item
export default class Link extends Component {
  render() {
    return (
      <li>
        <a target="_blank" href={this.props.link.url}>
          {this.props.link.text}
        </a>
      </li>
    );
  }
}
