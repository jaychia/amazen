import React from 'react';
import PropTypes from 'prop-types';
import ProductListing from './ProductListing.jsx';
import axios from 'axios';

export default class ResultPage extends React.Component {
    constructor() {
        super(...arguments);
        if (this.props.descriptors != "")
            this.state = { descriptors: this.props.descriptors.split(','), products: [] };
        else 
            this.state = { descriptors: [], products: [] };
        this.addButtonOnClick = this.addButtonOnClick.bind(this);
        this.searchButtonOnClick = this.searchButtonOnClick.bind(this);
    }

    componentDidMount() {
        axios.get("/search?query=" + this.props.query + "&descriptors=" + this.props.descriptors)
            .then(res => {
                this.setState({ products: res.data.data });
            });
    }

    searchButtonOnClick() {
        var descriptors_str = this.state.descriptors.join(",");
        window.location.href = "search_page?query=" + this.refs.New_search.value + "&descriptors=" + descriptors_str;
    }

    addButtonOnClick() {
        var new_d = this.refs.New_descriptor.value;
        this.refs.New_descriptor.value = "";
        if (new_d != "" && this.state.descriptors.indexOf(new_d) == -1)
            this.setState((prevState, props) => ({
                descriptors: [...prevState.descriptors, new_d]
            }));
    };

    deleteButtonOnClick(deletedName) {
        var arr = this.state.descriptors;
        var i = arr.indexOf(deletedName);
        arr.splice(i, 1);
        this.setState({ descriptors: arr });
    };

    render() {
        return (
            <div>
                <div className="result-page-bar-background">
                    <a href="/">
                        <img className="logo-small" src="/static/img/logo_s.png" width="200" />
                    </a>
                    <form className="form-inline result-page-bar">
                        <div className="search-bar">
                            <input className="search-bar-input input-lg" type="text" placeholder="What are you looking for today?" ref="New_search" defaultValue={this.props.query}/>
                            <div className="input-group-btn">
                                <button className="btn btn-lg search-bar-button" type="button" onClick={this.searchButtonOnClick}>
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
                                <button className="btn btn-lg search-bar-button" type="button" onClick={this.addButtonOnClick}>
                                    <span className="glyphicon glyphicon-plus"></span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                {this.state.products.map(function (p, i) {
                    return <ProductListing
                        key={i}
                        productTitle={p.productTitle}
                        price={p.price}
                        seller={p.seller}
                        desc={p.desc}
                        keywords={p.keywords}
                        keywordscores={p.keywordscores}
                        keywordScoreList={p.keywordscorelist}
                        rating={p.rating}
                        imgUrl={p.imgUrl}
                        numRatings={p.numRatings}
                        asin={p.asin} />
                })}
            </div>
        );
    }
}

ResultPage.propTypes = {
    query: PropTypes.string.isRequired,
    descriptors: PropTypes.string,
};