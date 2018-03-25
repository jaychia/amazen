import React from 'react';

export default class Search extends React.Component {
  props: {
    name: string,
    netid: string,
  };

  render() {
    return (
      <div>
        <link rel="stylesheet" href="/static/bootstrap.min.css" />
        <link rel="stylesheet" href="/static/main.css" />
        <div className="topcorner">
          <p>Project Name: {this.props.name}</p>
          <p>Student Name: {this.props.netid}</p>
        </div>
        <form className="form-inline global-search">
          <h1 style={{fontSize: 55, fontFamily: 'Futura', color: '#4285F4'}}>
            C
            <font color="#EA4335">S</font>
            <font color="#FBBC05">4</font>
            3
            <font color="#34A853">0</font>
            <font color="#EA4335">0</font>
          </h1>
          <br /><br />
          <div className="form-group">
            <input id="input" type="text" name="search" className="form-control" placeholder="Your Input" />
          </div>
          <button type="submit" className="btn btn-info"> Go! </button>
        </form>
      </div>
    );
  }
}
