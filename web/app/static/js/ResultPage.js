'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _jwReactPagination = require('jw-react-pagination');

var _jwReactPagination2 = _interopRequireDefault(_jwReactPagination);

var _ProductListing = require('./ProductListing.jsx');

var _ProductListing2 = _interopRequireDefault(_ProductListing);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _SearchBar = require('./SearchBar.jsx');

var _SearchBar2 = _interopRequireDefault(_SearchBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResultPage = function (_React$Component) {
    _inherits(ResultPage, _React$Component);

    function ResultPage() {
        _classCallCheck(this, ResultPage);

        var _this = _possibleConstructorReturn(this, (ResultPage.__proto__ || Object.getPrototypeOf(ResultPage)).apply(this, arguments));

        _this.state = { positive: _this.props.positive.length != 0 ? _this.props.positive.split(',') : [],
            negative: _this.props.negative.length != 0 ? _this.props.negative.split(',') : [],
            products: [],
            curr_products: [],
            suggestions: "" };
        _this.onChangePage = _this.onChangePage.bind(_this);
        return _this;
    }

    _createClass(ResultPage, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.setState({ loading: true });
            _axios2.default.get("/search?query=" + this.props.query + "&positive=" + this.props.positive + "&negative=" + this.props.negative).then(function (res) {
                _this2.setState({ loading: false });
                if (res.data.data.length > 0) {
                    _this2.setState({ products: res.data.data, suggestions: "", curr_products: _this2.state.products.slice(0, 10) });
                } else {
                    _this2.setState({ suggestions: res.data.suggestions, products: [] });
                }
            });
        }
    }, {
        key: 'onChangePage',
        value: function onChangePage(pageNum) {
            this.setState({ curr_products: pageNum });
            // ReactDom.findDOMNode(this).scrollIntoView();
        }
    }, {
        key: 'render',
        value: function render() {
            var body = _react2.default.createElement('div', null);
            if (this.state.loading) {
                body = _react2.default.createElement(
                    'div',
                    { className: 'loading-icon-wrapper' },
                    _react2.default.createElement('img', { src: '/static/img/loading.svg', alt: 'loading', style: { width: '100px', marginTop: '10%' } })
                );
            } else {
                if (this.state.suggestions.length == 0) {
                    var curr_data_list = [];
                    this.state.curr_products.map(function (p, i) {
                        curr_data_list.push(_react2.default.createElement(_ProductListing2.default, {
                            key: i + p.productTitle,
                            productTitle: p.productTitle,
                            price: p.price,
                            seller: p.seller,
                            desc: p.desc,
                            descriptors: p.descriptors,
                            descriptors_review_num: p.descriptors_review_num,
                            keywords: p.keywords,
                            keywordscores: p.keywordscores,
                            keywordScoreList: p.keywordscorelist,
                            keywordsSents: p.keywordssents,
                            rating: p.rating,
                            imgUrl: p.imgUrl,
                            numRatings: p.numRatings,
                            asin: p.asin }));
                    });
                    body = _react2.default.createElement(
                        'div',
                        null,
                        curr_data_list,
                        _react2.default.createElement(
                            'div',
                            { className: 'page-bar-wrapper' },
                            _react2.default.createElement(_jwReactPagination2.default, { items: this.state.products, onChangePage: this.onChangePage })
                        )
                    );
                } else {
                    body = _react2.default.createElement(
                        'div',
                        { className: 'error-container' },
                        _react2.default.createElement('img', { src: 'static/img/404.png', className: 'four-oh-four-img' }),
                        _react2.default.createElement(
                            'span',
                            null,
                            this.state.suggestions
                        )
                    );
                }
            }
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'result-page-bar-background' },
                    _react2.default.createElement(
                        'a',
                        { href: '/' },
                        _react2.default.createElement('img', { className: 'logo-small', src: '/static/img/logo_s.png', width: '200' })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'result-page-bar' },
                        _react2.default.createElement(_SearchBar2.default, { query: this.props.query, positives: this.state.positive, negatives: this.state.negative })
                    )
                ),
                body
            );
        }
    }]);

    return ResultPage;
}(_react2.default.Component);

exports.default = ResultPage;


ResultPage.propTypes = {
    query: _propTypes2.default.string.isRequired,
    descriptors: _propTypes2.default.string
};