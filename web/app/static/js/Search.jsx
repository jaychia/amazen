import React from 'react';

export default class Search extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {descriptors: []};
    this.buttonOnClick = this.buttonOnClick.bind(this);
  }

  buttonOnClick() {
    if(this.refs.New_descriptor.value != "")
      this.setState((prevState, props) => ({
        descriptors: [...prevState.descriptors, this.refs.New_descriptor.value]
      }));
  };

  render() {
    return (
      <div>
        <link rel="stylesheet" href="/static/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/static/css/bootstrap-grid.min.css" />
        <link rel="stylesheet" href="/static/css/bootstrap-reboot.min.css" />
        <link rel="stylesheet" href="/static/main.css" />
        <div className="text-center">
          <img src="/static/img/logo.png" width="400" />
        </div>
        <form className="form-inline global-search">
          <div className="search-bar">
            <input id="search_btn" type="text" className="input-lg" placeholder="What are you looking for today?" />
            <div className="input-group-btn">
              <button className="btn btn-lg" type="button">
                <span className="glyphicon glyphicon-search"></span>
              </button>
            </div>
          </div>
          <br />
          <div className="search-bar descriptor-bar">
            <input type="text" className="input-lg" placeholder="Descriptors" ref="New_descriptor"/>
            <div className="input-group-btn">
              <button className="btn btn-lg" type="button" onClick={this.buttonOnClick}>
                <span className="glyphicon glyphicon-plus"></span>
              </button>
            </div>
          </div>
        </form>
        <ul>
          {this.state.descriptors.map((message) => <li key={message}>{message}</li>)}
        </ul>
      </div>
    );
  }
}
