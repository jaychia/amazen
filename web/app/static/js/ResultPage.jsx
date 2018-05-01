import React from 'react';
import PropTypes from 'prop-types';
import JwPagination from 'jw-react-pagination';
import ProductListing from './ProductListing.jsx';
import axios from 'axios';
import SearchBar from './SearchBar.jsx';

export default class ResultPage extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { positive: (this.props.positive.length != 0) ? this.props.positive.split(',') : [], 
            negative: (this.props.negative.length != 0) ? this.props.negative.split(',') : [],
            products: [],
            curr_products: [],
            suggestions: "" };
        this.onChangePage = this.onChangePage.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });
        axios.get("/search?query=" + this.props.query + "&positive=" + this.props.positive + "&negative=" + this.props.negative)
            .then(res => {
                this.setState({ loading: false });
                if (res.data.data.length > 0) {
                    this.setState({ products: res.data.data, suggestions: "", curr_products: this.state.products.slice(0, 10)});
                } else {
                    this.setState({ suggestions: res.data.suggestions, products: [] });
                }
            });
    }

    onChangePage(pageNum) {
        this.setState({ curr_products: pageNum });
        // ReactDom.findDOMNode(this).scrollIntoView();
    }

    render() {
        let body = <div />;
        if (this.state.loading) {
            body = (<div className="loading-icon-wrapper">
                <img src="/static/img/loading.svg" alt="loading" style={{ width: '100px', marginTop: '10%' }} />
            </div>);
        } else {
            if (this.state.suggestions.length == 0) {
                let curr_data_list = [];
                this.state.curr_products.map(function (p, i) {
                    curr_data_list.push(<ProductListing
                        key={i + p.productTitle}
                        productTitle={p.productTitle}
                        price={p.price}
                        seller={p.seller}
                        desc={p.desc}
                        descriptors={p.descriptors}
                        descriptors_review_num={p.descriptors_review_num}
                        keywords={p.keywords}
                        keywordscores={p.keywordscores}
                        keywordScoreList={p.keywordscorelist}
                        keywordsSents={p.keywordssents}
                        rating={p.rating}
                        imgUrl={p.imgUrl}
                        numRatings={p.numRatings}
                        asin={p.asin} />);
                });
                body = <div>
                    {curr_data_list}
                    <div className="page-bar-wrapper">
                        <JwPagination items={this.state.products} onChangePage={this.onChangePage} />
                    </div>
                </div>;
            } else {
                body = (<div className="error-container">
                    <img src="static/img/404.png" className="four-oh-four-img" />
                    <span>:( {this.state.suggestions}</span>
                </div>);
            }
        }
        
        return (
            <div>
                <div className="result-page-bar-background">
                    <a href="/">
                        <img className="logo-small" src="/static/img/logo_s.png" width="200" />
                    </a>
                    <div className="result-page-bar">
                        <SearchBar query={this.props.query} positives={this.state.positive} negatives={this.state.negative} />
                    </div>
                </div>
                {body}
            </div>
        );
    }
}

ResultPage.propTypes = {
    query: PropTypes.string.isRequired,
    descriptors: PropTypes.string,
};