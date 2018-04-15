import React from 'react';

export default class Search extends React.Component {
  // constructor() {
  //   super(...arguments);
  //   this.state = {descriptors: []};
  // }
  //
  // buttonOnClick = () => {
  //   this.setState({descriptors = this.state.descriptors.add(this.refs.New_descriptor.value)});
  // };

  render() {
    return (
      <div>
        <link rel="stylesheet" href="/static/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/static/css/bootstrap-grid.min.css" />
        <link rel="stylesheet" href="/static/css/bootstrap-reboot.min.min.css" />
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
              <button className="btn btn-lg" type="button">
                <span className="glyphicon glyphicon-search"></span>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
