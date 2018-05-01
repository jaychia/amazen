import React from 'react';
import axios from 'axios';
import SearchBar from './SearchBar.jsx';

export default class Search extends React.Component {
  constructor() {
    super(...arguments);
  }
  
  render() {
    return (
      <div>
        <div className="text-center azn-logo">
          <img src="/static/img/logo.png" width="300" />
        </div>
        <SearchBar query="" positives={[]} negatives={[]} />
      </div>
    );
  }
}
