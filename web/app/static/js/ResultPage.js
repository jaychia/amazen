'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ProductListing = require('./ProductListing.jsx');

var _ProductListing2 = _interopRequireDefault(_ProductListing);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResultPage = function (_React$Component) {
    _inherits(ResultPage, _React$Component);

    function ResultPage() {
        _classCallCheck(this, ResultPage);

        var _this = _possibleConstructorReturn(this, (ResultPage.__proto__ || Object.getPrototypeOf(ResultPage)).apply(this, arguments));

        if (_this.props.descriptors != "") _this.state = { descriptors: _this.props.descriptors.split(','), products: [] };else _this.state = { descriptors: [], products: [] };
        _this.addButtonOnClick = _this.addButtonOnClick.bind(_this);
        _this.searchButtonOnClick = _this.searchButtonOnClick.bind(_this);
        return _this;
    }

    _createClass(ResultPage, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            _axios2.default.get("/search?query=" + this.props.query + "&descriptors=" + this.props.descriptors).then(function (res) {
                _this2.setState({ products: res.data.data });
            });
        }
    }, {
        key: 'searchButtonOnClick',
        value: function searchButtonOnClick() {
            var descriptors_str = this.state.descriptors.join(",");
            window.location.href = "search_page?query=" + this.refs.New_search.value + "&descriptors=" + descriptors_str;
        }
    }, {
        key: 'addButtonOnClick',
        value: function addButtonOnClick() {
            var new_d = this.refs.New_descriptor.value;
            this.refs.New_descriptor.value = "";
            if (new_d != "" && this.state.descriptors.indexOf(new_d) == -1) this.setState(function (prevState, props) {
                return {
                    descriptors: [].concat(_toConsumableArray(prevState.descriptors), [new_d])
                };
            });
        }
    }, {
        key: 'deleteButtonOnClick',
        value: function deleteButtonOnClick(deletedName) {
            var arr = this.state.descriptors;
            var i = arr.indexOf(deletedName);
            arr.splice(i, 1);
            this.setState({ descriptors: arr });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

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
                        'form',
                        { className: 'form-inline result-page-bar' },
                        _react2.default.createElement(
                            'div',
                            { className: 'search-bar' },
                            _react2.default.createElement('input', { className: 'search-bar-input input-lg', type: 'text', placeholder: 'What are you looking for today?', ref: 'New_search', defaultValue: this.props.query }),
                            _react2.default.createElement(
                                'div',
                                { className: 'input-group-btn' },
                                _react2.default.createElement(
                                    'button',
                                    { className: 'btn btn-lg search-bar-button', type: 'button', onClick: this.searchButtonOnClick },
                                    _react2.default.createElement('span', { className: 'glyphicon glyphicon-search' })
                                )
                            )
                        ),
                        _react2.default.createElement('br', null),
                        _react2.default.createElement(
                            'div',
                            { className: 'search-bar descriptor-bar' },
                            _react2.default.createElement(
                                'div',
                                { className: 'descriptor-wrapper' },
                                this.state.descriptors.map(function (d) {
                                    return _react2.default.createElement(
                                        'div',
                                        { key: d, className: 'descriptor-tag-wrapper' },
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'badge badge-default descriptor-tag' },
                                            d,
                                            _react2.default.createElement(
                                                'button',
                                                { className: 'btn descriptor-tag-button', type: 'button', onClick: function onClick() {
                                                        return _this3.deleteButtonOnClick(d);
                                                    } },
                                                _react2.default.createElement('span', { className: 'glyphicon glyphicon-remove' })
                                            )
                                        )
                                    );
                                }),
                                _react2.default.createElement('input', { type: 'text', className: 'input-lg descriptor-bar-input', placeholder: 'Descriptors', ref: 'New_descriptor' })
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'input-group-btn' },
                                _react2.default.createElement(
                                    'button',
                                    { className: 'btn btn-lg search-bar-button', type: 'button', onClick: this.addButtonOnClick },
                                    _react2.default.createElement('span', { className: 'glyphicon glyphicon-plus' })
                                )
                            )
                        )
                    )
                ),
                this.state.products.map(function (p, i) {
                    console.log(p);
                    return _react2.default.createElement(_ProductListing2.default, {
                        key: i,
                        productTitle: p.productTitle,
                        price: p.price,
                        seller: p.seller,
                        desc: p.desc,
                        keywords: p.keywords,
                        keywordscores: p.keywordscores,
                        keywordScoreList: p.keywordscorelist,
                        rating: p.rating,
                        imgUrl: p.imgUrl,
                        numRatings: p.numRatings,
                        asin: p.asin });
                })
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