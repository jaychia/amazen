'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _Descriptor = require('./Descriptor.jsx');

var _Descriptor2 = _interopRequireDefault(_Descriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchBar = function (_React$Component) {
    _inherits(SearchBar, _React$Component);

    function SearchBar() {
        _classCallCheck(this, SearchBar);

        /* sugg = {text: string, status: "HIDDEN", "NEUTRAL", "UP", "DOWN"} */
        var _this = _possibleConstructorReturn(this, (SearchBar.__proto__ || Object.getPrototypeOf(SearchBar)).apply(this, arguments));

        var list_to_suggs = function list_to_suggs(str_list, stat) {
            return str_list.map(function (str) {
                return { text: str, status: stat };
            });
        };
        _this.state = { suggs: list_to_suggs(_this.props.positives, "UP").concat(list_to_suggs(_this.props.negatives, "DOWN")), querysuggs: [], readytosearch: false };
        _this.likeButtonOnClick = _this.likeButtonOnClick.bind(_this);
        _this.dislikeButtonOnClick = _this.dislikeButtonOnClick.bind(_this);
        _this.setNeutralButtonOnClick = _this.setNeutralButtonOnClick.bind(_this);
        _this.getNewSuggestions = _this.getNewSuggestions.bind(_this);
        _this.searchButtonOnClick = _this.searchButtonOnClick.bind(_this);
        _this.queryChange = _this.queryChange.bind(_this);
        _this.querySuggestionTagClick = _this.querySuggestionTagClick.bind(_this);
        return _this;
    }

    _createClass(SearchBar, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            document.addEventListener("keydown", this.handleEnterPressed.bind(this));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            document.removeEventListener("keydown", this.handleEnterPressed.bind(this));
        }
    }, {
        key: 'handleEnterPressed',
        value: function handleEnterPressed(e) {
            if (e.key == "Enter") {
                e.preventDefault();
                if (!this.state.readytosearch) this.getNewSuggestions();else this.searchButtonOnClick();
            }
        }
    }, {
        key: 'querySuggestionTagClick',
        value: function querySuggestionTagClick(s) {
            this.refs.New_search.value = this.refs.New_search.value + " " + s;
            this.setState(function (prevState, props) {
                return {
                    querysuggs: [].concat(_toConsumableArray(prevState.querysuggs.filter(function (t) {
                        return t != s;
                    }))),
                    readytosearch: false
                };
            });
        }
    }, {
        key: 'queryChange',
        value: function queryChange() {
            var _this2 = this;

            var curr_query = this.refs.New_search.value.toLowerCase();
            if (this.state.suggs.length == 0) {
                _axios2.default.get("/query_suggestions?query=" + curr_query).then(function (res) {
                    if (res.data.querystring == curr_query) {
                        _this2.setState(function (prevState, props) {
                            return { querysuggs: res.data.data };
                        });
                    }
                });
            }
            this.setState(function (prevState, props) {
                return {
                    suggs: prevState.suggs.filter(function (s) {
                        return s.status != "HIDDEN" && s.status != "NEUTRAL";
                    }),
                    readytosearch: false
                };
            });
        }
    }, {
        key: 'getNewSuggestions',
        value: function getNewSuggestions() {
            var _this3 = this;

            _axios2.default.get("/suggestions?query=" + this.refs.New_search.value.toLowerCase() + "&positive=" + this.state.suggs.filter(function (sugg) {
                return sugg.status == "UP";
            }).map(function (sugg) {
                return sugg.text;
            }).join(",") + "&negative=" + this.state.suggs.filter(function (sugg) {
                return sugg.status == "DOWN";
            }).map(function (sugg) {
                return sugg.text;
            }).join(",") + "&neutral=" + this.state.suggs.filter(function (sugg) {
                return sugg.status == "HIDDEN" || sugg.status == "NEUTRAL";
            }).map(function (sugg) {
                return sugg.text;
            }).join(",")).then(function (res) {
                // Hide previous neutrals and add new suggestions as neutrals
                var hiddenstate = _this3.state.suggs.map(function (sugg) {
                    return sugg.status == "NEUTRAL" ? { text: sugg.text, status: "HIDDEN" } : sugg;
                });
                var string_to_suggs = function string_to_suggs(str_list) {
                    return str_list.map(function (str) {
                        return { text: str, status: "NEUTRAL" };
                    });
                };
                _this3.setState(function (prevState, props) {
                    return { suggs: [].concat(_toConsumableArray(hiddenstate), _toConsumableArray(string_to_suggs(res.data.data))) };
                });
            });
            this.setState({ readytosearch: true });
        }
    }, {
        key: 'likeButtonOnClick',
        value: function likeButtonOnClick(suggtext) {
            this.setState(function (prevState, props) {
                return {
                    suggs: prevState.suggs.map(function (sugg) {
                        return sugg.text !== suggtext ? sugg : { text: suggtext, status: "UP" };
                    })
                };
            });
        }
    }, {
        key: 'dislikeButtonOnClick',
        value: function dislikeButtonOnClick(suggtext) {
            this.setState(function (prevState, props) {
                return {
                    suggs: prevState.suggs.map(function (sugg) {
                        return sugg.text !== suggtext ? sugg : { text: suggtext, status: "DOWN" };
                    })
                };
            });
        }
    }, {
        key: 'setNeutralButtonOnClick',
        value: function setNeutralButtonOnClick(suggtext) {
            this.setState(function (prevState, props) {
                return {
                    suggs: prevState.suggs.map(function (sugg) {
                        return sugg.text !== suggtext ? sugg : { text: suggtext, status: "NEUTRAL" };
                    })
                };
            });
        }
    }, {
        key: 'searchButtonOnClick',
        value: function searchButtonOnClick() {
            window.location.href = "search_page?query=" + this.refs.New_search.value + "&positive=" + this.state.suggs.filter(function (sugg) {
                return sugg.status == "UP";
            }).map(function (sugg) {
                return sugg.text;
            }).join(",") + "&negative=" + this.state.suggs.filter(function (sugg) {
                return sugg.status == "DOWN";
            }).map(function (sugg) {
                return sugg.text;
            }).join(",");
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var searchButton = this.state.readytosearch ? _react2.default.createElement(
                'button',
                { className: 'btn btn-lg search-bar-button', type: 'button', onClick: function onClick() {
                        return _this4.searchButtonOnClick();
                    } },
                _react2.default.createElement('span', { className: 'glyphicon glyphicon-search' })
            ) : _react2.default.createElement(
                'button',
                { className: 'btn btn-lg search-bar-button', type: 'button', onClick: function onClick() {
                        return _this4.getNewSuggestions();
                    } },
                _react2.default.createElement('span', { className: 'glyphicon glyphicon-chevron-down' })
            );
            return _react2.default.createElement(
                'form',
                { className: 'form-inline global-search search-wrapper' },
                _react2.default.createElement(
                    'div',
                    { className: 'search-bar card card-1' },
                    _react2.default.createElement('input', { className: 'search-bar-input input-lg', defaultValue: this.props.query, onChange: this.queryChange, type: 'text', placeholder: 'What product are you looking for today?', ref: 'New_search' }),
                    _react2.default.createElement(
                        'div',
                        { className: 'input-group-btn' },
                        searchButton
                    )
                ),
                this.state.querysuggs.length > 0 && _react2.default.createElement(
                    'div',
                    { className: 'query-suggestions-container' },
                    _react2.default.createElement(
                        'span',
                        { className: 'suggestionTag' },
                        'Suggestions:\xA0'
                    ),
                    this.state.querysuggs.map(function (s, i) {
                        return _react2.default.createElement(
                            'span',
                            { key: s + Date.now().toString() + i.toString(), className: 'suggestionTag' },
                            _react2.default.createElement(
                                'span',
                                { className: 'suggestionTag tag',
                                    onClick: function onClick() {
                                        return _this4.querySuggestionTagClick(s);
                                    } },
                                s
                            ),
                            ',\xA0'
                        );
                    })
                ),
                _react2.default.createElement('br', null),
                this.state.suggs.length > 0 && _react2.default.createElement(
                    'div',
                    { className: 'desc-search-container' },
                    _react2.default.createElement(
                        'div',
                        { className: 'desc-container' },
                        this.state.suggs.filter(function (s) {
                            return s.status != "HIDDEN";
                        }).map(function (s, i) {
                            return _react2.default.createElement(_Descriptor2.default, {
                                key: s.text + "-descriptor-key",
                                text: s.text,
                                status: s.status,
                                onLikeClick: _this4.likeButtonOnClick,
                                onDislikeClick: _this4.dislikeButtonOnClick,
                                onCancelClick: _this4.setNeutralButtonOnClick });
                        }),
                        _react2.default.createElement(
                            'button',
                            { type: 'button', className: 'card card-1 refresh-button', onClick: this.getNewSuggestions },
                            _react2.default.createElement(
                                'span',
                                null,
                                'Refresh Descriptors...'
                            )
                        )
                    )
                )
            );
        }
    }]);

    return SearchBar;
}(_react2.default.Component);

exports.default = SearchBar;