import React from 'react';
import axios from 'axios';
import Descriptor from './Descriptor.jsx';

export default class SearchBar extends React.Component {
    constructor() {
        super(...arguments);
        /* sugg = {text: string, status: "HIDDEN", "NEUTRAL", "UP", "DOWN"} */
        let list_to_suggs = (str_list, stat) => str_list.map((str) => ({ text: str, status: stat }));
        this.state = { suggs: list_to_suggs(this.props.positives, "UP").concat(list_to_suggs(this.props.negatives, "DOWN")), 
            querysuggs: [], readytosearch: false, noSuggs : false, replace_query: false, loading: false};
        this.likeButtonOnClick = this.likeButtonOnClick.bind(this);
        this.dislikeButtonOnClick = this.dislikeButtonOnClick.bind(this);
        this.setNeutralButtonOnClick = this.setNeutralButtonOnClick.bind(this);
        this.getNewSuggestions = this.getNewSuggestions.bind(this);
        this.searchButtonOnClick = this.searchButtonOnClick.bind(this);
        this.queryChange = this.queryChange.bind(this);
        this.querySuggestionTagClick = this.querySuggestionTagClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleEnterPressed.bind(this));
        window.typertimer = null;
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleEnterPressed.bind(this));
    }

    handleEnterPressed(e) {
        if (e.key == "Enter") {
            e.preventDefault();
            if (!this.state.readytosearch)
                this.getNewSuggestions();
            else
                this.searchButtonOnClick();
        }
    }

    querySuggestionTagClick(s) {
        if(this.state.replace_query){
            this.refs.New_search.value = s;
        }
        else{
            this.refs.New_search.value = this.refs.New_search.value + " " + s;
        }

        this.setState((prevState, props) => ({
            querysuggs: [...prevState.querysuggs.filter(t => t != s)],
            readytosearch: false
        }));
    }

    queryChange() {
        this.setState({noSuggs: false});
        let curr_query = this.refs.New_search.value.toLowerCase();
        if (!this.state.readytosearch) {
            clearTimeout(window.typertimer);
            window.typertimer = setTimeout(() => {
                axios.get(
                    "/query_suggestions?query=" + curr_query
                ).then(res => {
                    console.log(res.data.data);
                    if (res.data.querystring == curr_query) {
                        this.setState((prevState, props) => ({ querysuggs: res.data.data }));
                    }
                    if (res.data.replace == 1) {
                        this.setState({ replace_query: true });
                    }
                    else {
                        this.setState({ replace_query: false });
                    }
                });}, 500);
        }
        this.setState((prevState, props) => ({
            suggs: prevState.suggs.filter(s => s.status != "HIDDEN" && s.status != "NEUTRAL"),
            readytosearch: false
        }));
    }

    getNewSuggestions() {
        this.setState({ loading: true });
        axios.get(
            "/suggestions?query=" + this.refs.New_search.value.toLowerCase() +
            "&positive=" + this.state.suggs.filter(sugg => sugg.status == "UP").map(sugg => sugg.text).join(",") +
            "&negative=" + this.state.suggs.filter(sugg => sugg.status == "DOWN").map(sugg => sugg.text).join(",") +
            "&neutral=" + this.state.suggs.filter(sugg => sugg.status == "HIDDEN" || sugg.status == "NEUTRAL").map(sugg => sugg.text).join(",")
        ).then(res => {
            this.setState({ loading: false });
            // Hide previous neutrals and add new suggestions as neutrals
            let hiddenstate = this.state.suggs.map((sugg) => {
                return (sugg.status == "NEUTRAL") ? { text: sugg.text, status: "HIDDEN" } : sugg;
            });
            let string_to_suggs = (str_list) => str_list.map((str) => ({ text: str, status: "NEUTRAL" }));
            this.setState((prevState, props) => ({ suggs: [...hiddenstate, ...string_to_suggs(res.data.data)] }));
            if(this.state.suggs.length == 0){
                this.setState({ noSuggs: true, readytosearch: false });
            }
            else{
                this.setState({ readytosearch: true, noSuggs: false });
            }
        });
    }

    likeButtonOnClick(suggtext) {
        console.log((this.state.suggs.reduce(((acc, v) => acc || (v.text == suggtext)), false)));
        let newstates = (this.state.suggs.reduce(((acc, v) => acc || (v.text == suggtext)), false)) ? 
            this.state.suggs.map(sugg => (sugg.text !== suggtext) ? sugg : { text: suggtext, status: "UP" }) :
            this.state.suggs.concat({text: suggtext, status: "UP"});
        this.setState((prevState, props) => ({
            suggs: newstates
        }));
    }

    dislikeButtonOnClick(suggtext) {
        let newstates = (this.state.suggs.reduce(((acc, v) => acc || (v.text == suggtext)), false)) ?
            this.state.suggs.map(sugg => (sugg.text !== suggtext) ? sugg : { text: suggtext, status: "DOWN" }) :
            this.state.suggs.concat({ text: suggtext, status: "DOWN" });
        this.setState((prevState, props) => ({
            suggs: newstates
        }));
    }

    setNeutralButtonOnClick(suggtext) {
        this.setState((prevState, props) => ({
            suggs: prevState.suggs.map(sugg => (sugg.text !== suggtext) ? sugg : { text: suggtext, status: "NEUTRAL" })
        }));
    }

    searchButtonOnClick() {
        window.location.href = "search_page?query=" + this.refs.New_search.value +
            "&positive=" + this.state.suggs.filter(sugg => sugg.status == "UP").map(sugg => sugg.text).join(",") +
            "&negative=" + this.state.suggs.filter(sugg => sugg.status == "DOWN").map(sugg => sugg.text).join(",");
    }

    render() {
        let searchButton = (this.state.loading) ? (
            <button className="btn btn-lg search-bar-button" type="button">
                <img src="/static/img/loading.svg" alt="loading" style={{width: '26px'}} />
            </button>
        ) : (this.state.readytosearch ?
                (<button className="btn btn-lg search-bar-button" type="button" onClick={() => this.searchButtonOnClick()}>
                    <span className="glyphicon glyphicon-search"></span>
                </button>) :
                (<button className="btn btn-lg search-bar-button" type="button" onClick={() => this.getNewSuggestions()}>
                    <span className="glyphicon glyphicon-chevron-down"></span>
                </button>)
            )
        return (
            <form className="form-inline global-search search-wrapper">
                <div className="search-bar card card-1">
                    <input className="search-bar-input input-lg" defaultValue={this.props.query} onChange={this.queryChange} type="text" placeholder="What product are you looking for today?" ref="New_search" />
                    <div className="input-group-btn">
                        {searchButton}
                    </div>
                </div>
                {this.state.noSuggs &&
                    <label htmlFor="search-bar card card-1" className="search-error tri-right left-top">No results for this search</label>
                }
                {this.state.querysuggs.length > 0 &&
                    <div className="query-suggestions-container">
                        {this.state.replace_query?<span className="suggestionTag">Did You Mean:&nbsp;</span>:
                        <span className="suggestionTag">Suggestions:&nbsp;</span>
                    }
                        {this.state.querysuggs.map((s, i) =>
                            <span key={s + Date.now().toString() + i.toString()} className="suggestionTag">
                                <span className="suggestionTag tag" onClick={() => this.querySuggestionTagClick(s)}>
                                    {s}
                                </span>&nbsp;
                            </span>)
                    }
                    </div>
                }
                <br />
                {this.state.suggs.length > 0 &&
                    <div className="desc-search-container">
                        <div className="desc-container">
                            {this.state.suggs.filter(s => s.status != "HIDDEN").map((s, i) =>
                                <Descriptor
                                    key={s.text + "-descriptor-key"}
                                    text={s.text}
                                    status={s.status}
                                    onLikeClick={this.likeButtonOnClick}
                                    onDislikeClick={this.dislikeButtonOnClick}
                                    onCancelClick={this.setNeutralButtonOnClick}
                                    mutable={false} />
                            )}
                            <Descriptor
                                text={"Add new Descriptor"}
                                status={"NEUTRAL"}
                                onLikeClick={this.likeButtonOnClick}
                                onDislikeClick={this.dislikeButtonOnClick}
                                onCancelClick={this.setNeutralButtonOnClick}
                                mutable={true} />
                            <button type="button" className="card card-1 refresh-button" onClick={this.getNewSuggestions}>
                                <span>Refresh Descriptors...</span>
                            </button>
                        </div>
                    </div>
                }
            </form>
        );
    }
}
