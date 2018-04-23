import React from 'react';
import axios from 'axios';

export default class Search extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {descriptors: [], suggestions: []};
    this.addButtonOnClick = this.addButtonOnClick.bind(this);
    this.searchButtonOnClick = this.searchButtonOnClick.bind(this);
    this.suggestionTagOnClick = this.suggestionTagOnClick.bind(this);
    this.getNewSuggestions = this.getNewSuggestions.bind(this);
  }

  getNewSuggestions() {
    axios.get("/suggestions?query=" + this.refs.New_search.value + "," + this.state.descriptors.join(","))
      .then(res => {
        this.setState({ suggestions: res.data.data });
      });
  }

  suggestionTagOnClick(sugg) {
    if (sugg != "" && this.state.descriptors.indexOf(sugg) == -1) {
      this.setState((prevState, props) => ({
        descriptors: [...prevState.descriptors, sugg]
      }), () => {this.getNewSuggestions();});
    }
  }

  searchButtonOnClick() {
    var descriptors_str = this.state.descriptors.join(",");
    window.location.href = "search_page?query=" + this.refs.New_search.value + "&descriptors=" + descriptors_str;
  }

  addButtonOnClick() {
    var new_d = this.refs.New_descriptor.value;
    this.refs.New_descriptor.value = "";
    if(new_d != "" && this.state.descriptors.indexOf(new_d) == -1)
      this.setState((prevState, props) => ({
        descriptors: [...prevState.descriptors, new_d]
      }), () => {this.getNewSuggestions();});
  };

  deleteButtonOnClick(deletedName) {
    var arr = this.state.descriptors;
    var i = arr.indexOf(deletedName);
    arr.splice(i, 1);
    this.setState({descriptors: arr});
  };

  render() {
    return (
      <div>
        <div className="text-center">
          <img src="/static/img/logo.png" width="400" />
        </div>
        <form className="form-inline global-search search-wrapper">
          <div className="search-bar">
            <input className="search-bar-input input-lg" type="text" placeholder="What are you looking for today?" ref="New_search"/>
            <div className="input-group-btn">
              <button className="btn btn-lg search-bar-button" type="button" onClick={() => this.searchButtonOnClick()}>
                <span className="glyphicon glyphicon-search"></span>
              </button>
            </div>
          </div>
          <br />
            <div className="search-bar descriptor-bar">
              <div className="descriptor-wrapper">
                {this.state.descriptors.map((d) =>
                  <div key={d} className="descriptor-tag-wrapper">
                      <span className="badge badge-default descriptor-tag">
                        {d}
                        <button className="btn descriptor-tag-button" type="button" onClick={() => this.deleteButtonOnClick(d)}>
                          <span className="glyphicon glyphicon-remove"></span>
                        </button>
                      </span>
                  </div>
                )}
                <input type="text" className="input-lg descriptor-bar-input" placeholder="Descriptors" ref="New_descriptor" />
              </div>
              <div className="input-group-btn">
                <button className="btn btn-lg search-bar-button" type="button" onClick={() => this.addButtonOnClick()}>
                  <span className="glyphicon glyphicon-plus"></span>
                </button>
              </div>
            </div>
          <div className="descriptor-bar-container">
            {this.state.suggestions.length > 0 && 
              <div>
              <span className="suggestionTag">Suggestions:&nbsp;</span>
                {this.state.suggestions.map((s, i) =>
                <span key={s + Date.now().toString() + i.toString()} className="suggestionTag">
                  <span className="suggestionTag tag" onClick={() => this.suggestionTagOnClick(s)}>{s}</span>,&nbsp;
                </span>
                )}
              </div>}
          </div>
        </form>
      </div>
    );
  }
}
