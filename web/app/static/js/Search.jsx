import React from 'react';
import axios from 'axios';
import Descriptor from './Descriptor.jsx';

export default class Search extends React.Component {
  constructor() {
    super(...arguments);
    /* sugg = {text: string, status: "HIDDEN", "NEUTRAL", "UP", "DOWN"} */
    this.state = {suggs: [], querysuggs:[]};
    this.likeButtonOnClick = this.likeButtonOnClick.bind(this);
    this.dislikeButtonOnClick = this.likeButtonOnClick.bind(this);
    this.setNeutralButtonOnClick = this.setNeutralButtonOnClick.bind(this);
    this.getNewSuggestions = this.getNewSuggestions.bind(this);
    this.searchButtonOnClick = this.searchButtonOnClick.bind(this);
    this.queryChange = this.queryChange.bind(this);
    this.querySuggestionTagClick = this.querySuggestionTagClick.bind(this);
  }

  querySuggestionTagClick(s) {
    this.refs.New_search.value = this.refs.New_search.value + " " + s;
    this.setState((prevState, props) => ({
      querysuggs: [...prevState.querysuggs.filter(t => t != s)]
    }));
  }

  queryChange() {
    let curr_query = this.refs.New_search.value;
    if (this.state.suggs.length == 0) {
      axios.get(
        "/query_suggestions?query=" + curr_query
      ).then(res => {
        if (res.data.querystring == curr_query) {
          this.setState((prevState, props) => ({ querysuggs: res.data.data }));
        }
      });
    }
  }

  getNewSuggestions() {
    axios.get(
      "/suggestions?query=" + this.refs.New_search.value + 
      "&positive=" + this.state.suggs.filter(sugg => sugg.status == "UP").map(sugg => sugg.text).join(",") +
      "&negative=" + this.state.suggs.filter(sugg => sugg.status == "DOWN").map(sugg => sugg.text).join(",") +
      "&neutral=" + this.state.suggs.filter(sugg => sugg.status == "HIDDEN" || sugg.status == "NEUTRAL").map(sugg => sugg.text).join(",")
      ).then(res => {
        // Hide previous neutrals and add new suggestions as neutrals
        let hiddenstate = this.state.suggs.map((sugg) => {
          return (sugg.status == "NEUTRAL") ? { text: sugg.text, status: "HIDDEN" } : sugg;
        });
        console.log(this.state.suggs);
        console.log(hiddenstate);
        let string_to_suggs = (str_list) => str_list.map((str) => ({ text: str, status: "NEUTRAL" }));
        this.setState((prevState, props) => ({ suggs: [...hiddenstate, ...string_to_suggs(res.data.data)] }));
      });
  }

  likeButtonOnClick(suggtext) {
    this.setState((prevState, props) => ({
      suggs: prevState.map(sugg => {(sugg.text !== suggtext) ? sugg : {text: suggtext, status: "UP"}})
    }));
  }

  dislikeButtonOnClick(suggtext) {
    this.setState((prevState, props) => ({
      suggs: prevState.map(sugg => { (sugg.text !== suggtext) ? sugg : { text: suggtext, status: "DOWN" } })
    }));
  }

  setNeutralButtonOnClick(suggtext) {
    this.setState((prevState, props) => ({
      suggs: prevState.map(sugg => { (sugg.text !== suggtext) ? sugg : { text: suggtext, status: "NEUTRAL" } })
    }));
  }

  searchButtonOnClick() {
    window.location.href = "search_page?query=" + this.refs.New_search.value + 
      "&positive=" + this.state.suggs.filter(sugg => sugg.status == "UP").map(sugg => sugg.text).join(",") +
      "&negative=" + this.state.suggs.filter(sugg => sugg.status == "DOWN").map(sugg => sugg.text).join(",");
  }

  render() {
    let searchButton = (this.state.suggs.length != 0) ? (
      <button className="btn btn-lg search-bar-button" type="button" onClick={() => this.searchButtonOnClick()}>
        <span className="glyphicon glyphicon-search"></span>
      </button>
    ) : (
        <button className="btn btn-lg search-bar-button" type="button" onClick={() => this.getNewSuggestions()}>
          <span className="glyphicon glyphicon-chevron-down"></span>
        </button>
    )
    return (
      <div>
        <div className="text-center">
          <img src="/static/img/logo.png" width="400" />
        </div>
        <form className="form-inline global-search search-wrapper">
          <div className="search-bar">
            <input className="search-bar-input input-lg" onChange={this.queryChange} type="text" placeholder="What are you looking for today?" ref="New_search"/>
            <div className="input-group-btn">
              {searchButton}
            </div>
          </div>
          {this.state.querysuggs.length > 0 &&
          <div className="query-suggestions-container">
            <span className="suggestionTag">Suggestions:&nbsp;</span>
            {this.state.querysuggs.map((s, i) =>
              <span key={s + Date.now().toString() + i.toString()} className="suggestionTag">
                <span className="suggestionTag tag" 
                  onClick={() => this.querySuggestionTagClick(s)}>{s}
                </span>,&nbsp;
              </span>)}
          </div>}
          <br />
          <div className="descriptor-bar-container">
            {this.state.suggs.length > 0 &&
              <div className="desc-search-container">
                <button type="button" className="refresh-button" onClick={this.getNewSuggestions}>
                  <span className="glyphicon glyphicon-repeat"></span>
                </button>
                <div className="desc-container">
                  {this.state.suggs.map((s, i) =>
                  <Descriptor
                  key={s.text + "-descriptor-key"}
                  text={s.text}
                  status={s.status} 
                  onLikeClick={this.likeButtonOnClick} 
                  onDislikeClick={this.dislikeButtonOnClick}
                  onCancelClick={this.setNeutralButtonOnClick} />
                  )}
                </div>
              </div>
            }
          </div>
        </form>
      </div>
    );
  }
}
