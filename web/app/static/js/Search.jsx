import React from 'react';
import axios from 'axios';
import Descriptor from './Descriptor.jsx';

export default class Search extends React.Component {
  constructor() {
    super(...arguments);
    /* sugg = {text: string, status: "HIDDEN", "NEUTRAL", "UP", "DOWN"} */
    this.state = {suggs = []};
    this.likeButtonOnClick = this.likeButtonOnClick.bind(this);
    this.dislikeButtonOnClick = this.likeButtonOnClick.bind(this);
    this.setNeutralButtonOnClick = this.setNeutralButtonOnClick.bind(this);
    this.getNewSuggestions = this.getNewSuggestions.bind(this);
    this.searchButtonOnClick = this.searchButtonOnClick.bind(this);
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
          (sugg.status == "NEUTRAL") ? { text: sugg.text, status: "HIDDEN" } : sugg;
        });
        let string_to_suggs = (str) => ({text: str, status: "NEUTRAL"});
        this.setState((prevState, props) => ({ suggs: [...hiddenstate, string_to_suggs(res.data.data)] }));
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
    var descriptors_str = this.state.descriptors.join(",");
    window.location.href = "search_page?query=" + this.refs.New_search.value + 
      "&positive=" + this.state.suggs.filter(sugg => sugg.status == "UP").map(sugg => sugg.text).join(",") +
      "&negative=" + this.state.suggs.filter(sugg => sugg.status == "DOWN").map(sugg => sugg.text).join(",");
  }

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
          <div className="descriptor-bar-container">
            {this.state.suggs.length > 0 &&
              <div>
                {this.state.suggs.map((s, i) =>
                <Descriptor text={sugg.text} 
                status={sugg.status} 
                onLikeClick={this.likeButtonOnClick} 
                onDislikeClick={this.dislikeButtonOnClick}
                onCancelClick={this.setNeutralButtonOnClick} />
                )}
              </div>}
          </div>
        </form>
      </div>
    );
  }
}
