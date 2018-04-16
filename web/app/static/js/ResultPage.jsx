import React from 'react';
import PropTypes from 'prop-types';
import ProductListing from './ProductListing.jsx';

export default class ResultPage extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { descriptors: this.props.descriptors.split(',') };
        this.addButtonOnClick = this.addButtonOnClick.bind(this);
        this.searchButtonOnClick = this.searchButtonOnClick.bind(this);
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
                    <img className="logo-small" src="/static/img/logo_s.png" width="200" />
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
                {Array.from(Array(this.props.productTitle.length).keys()).map((i) =>
                    <ProductListing
                        key={i}
                        productTitle={this.props.productTitle[i]}
                        price={this.props.price[i]}
                        seller={this.props.seller[i]}
                        desc={this.props.desc[i]}
                        keywords={this.props.keywords[i]}
                        keywordscores={this.props.keywordscores[i]}
                        rating={this.props.rating[i]}
                        imgUrl={this.props.imgUrl[i]}
                        numRatings={this.props.numRatings[i]} />
                )}
            </div>
        );
    }
}

ResultPage.propTypes = {
    query: PropTypes.string.isRequired,
    descriptors: PropTypes.string,
    productTitle: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.arrayOf(PropTypes.number),
    seller: PropTypes.arrayOf(PropTypes.string),
    desc: PropTypes.arrayOf(PropTypes.string),
    keywords: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    keywordscores: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    rating: PropTypes.arrayOf(PropTypes.number),
    imgUrl: PropTypes.arrayOf(PropTypes.string),
    numRatings: PropTypes.arrayOf(PropTypes.number),
};