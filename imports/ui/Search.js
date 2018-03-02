import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import { Links } from '../api/links.js';


// Link component - represents a single link item
export default class Search extends Component {
	constructor(props){
		super(props);
		this.state = {
			searchValue: '',
      loading: false
  	}
  }

  handleChange(event) {
  	let searchValue = event.target.value;
  	this.setState({ searchValue });
  }


//  	onSubmit(e){
//  			browserHistory.push({
//  				pathname: '/results',
//  				query: { name: this.state.searchValue }
//  			});
//  	}

  handleSubmit(event) {
    event.preventDefault();
    this.setState({loading: true});
    const search = ReactDOM.findDOMNode(this.refs.searchInput).value.trim();
    console.log(`Search for : ${search}`);
    this.setState({loading: false});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)} className="searchForm" >
        <input className="searchForm"
          type="text"
          ref="searchInput"
          placeholder="Enter your request here"
          value={this.state.searchValue}
          onChange={this.handleChange.bind(this)}
        />
        <input className="searchForm"
          type="submit"
          value="Search"
        />
      </form>
    );
  }
}
