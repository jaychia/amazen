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

var Search = function (_React$Component) {
  _inherits(Search, _React$Component);

  function Search() {
    _classCallCheck(this, Search);

    /* sugg = {text: string, status: "HIDDEN", "NEUTRAL", "UP", "DOWN"} */
    var _this = _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).apply(this, arguments));

    _this.state = { suggs: [], querysuggs: [] };
    _this.likeButtonOnClick = _this.likeButtonOnClick.bind(_this);
    _this.dislikeButtonOnClick = _this.likeButtonOnClick.bind(_this);
    _this.setNeutralButtonOnClick = _this.setNeutralButtonOnClick.bind(_this);
    _this.getNewSuggestions = _this.getNewSuggestions.bind(_this);
    _this.searchButtonOnClick = _this.searchButtonOnClick.bind(_this);
    _this.queryChange = _this.queryChange.bind(_this);
    return _this;
  }

  _createClass(Search, [{
    key: 'queryChange',
    value: function queryChange() {
      var _this2 = this;

      var curr_query = this.refs.New_search.value;
      if (this.state.suggs.length == 0) {
        _axios2.default.get("/query_suggestions?query=" + curr_query).then(function (res) {
          if (res.data.querystring == curr_query) {
            _this2.setState(function (prevState, props) {
              return { querysuggs: res.data.data };
            });
          }
        });
      }
    }
  }, {
    key: 'getNewSuggestions',
    value: function getNewSuggestions() {
      var _this3 = this;

      _axios2.default.get("/suggestions?query=" + this.refs.New_search.value + "&positive=" + this.state.suggs.filter(function (sugg) {
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
          sugg.status == "NEUTRAL" ? { text: sugg.text, status: "HIDDEN" } : sugg;
        });
        var string_to_suggs = function string_to_suggs(str) {
          return { text: str, status: "NEUTRAL" };
        };
        _this3.setState(function (prevState, props) {
          return { suggs: [].concat(_toConsumableArray(hiddenstate), [string_to_suggs(res.data.data)]) };
        });
      });
    }
  }, {
    key: 'likeButtonOnClick',
    value: function likeButtonOnClick(suggtext) {
      this.setState(function (prevState, props) {
        return {
          suggs: prevState.map(function (sugg) {
            sugg.text !== suggtext ? sugg : { text: suggtext, status: "UP" };
          })
        };
      });
    }
  }, {
    key: 'dislikeButtonOnClick',
    value: function dislikeButtonOnClick(suggtext) {
      this.setState(function (prevState, props) {
        return {
          suggs: prevState.map(function (sugg) {
            sugg.text !== suggtext ? sugg : { text: suggtext, status: "DOWN" };
          })
        };
      });
    }
  }, {
    key: 'setNeutralButtonOnClick',
    value: function setNeutralButtonOnClick(suggtext) {
      this.setState(function (prevState, props) {
        return {
          suggs: prevState.map(function (sugg) {
            sugg.text !== suggtext ? sugg : { text: suggtext, status: "NEUTRAL" };
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

      console.log(this.state.suggs);
      console.log(this.state.querysuggs);
      var searchButton = this.state.suggs.length != 0 ? _react2.default.createElement(
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
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'text-center' },
          _react2.default.createElement('img', { src: '/static/img/logo.png', width: '400' })
        ),
        _react2.default.createElement(
          'form',
          { className: 'form-inline global-search search-wrapper' },
          _react2.default.createElement(
            'div',
            { className: 'search-bar' },
            _react2.default.createElement('input', { className: 'search-bar-input input-lg', onChange: this.queryChange, type: 'text', placeholder: 'What are you looking for today?', ref: 'New_search' }),
            _react2.default.createElement(
              'div',
              { className: 'input-group-btn' },
              searchButton
            )
          ),
          _react2.default.createElement('br', null),
          _react2.default.createElement(
            'div',
            { className: 'descriptor-bar-container' },
            this.state.suggs.length > 0 && _react2.default.createElement(
              'div',
              null,
              this.state.suggs.map(function (s, i) {
                return _react2.default.createElement(_Descriptor2.default, { text: sugg.text,
                  status: sugg.status,
                  onLikeClick: _this4.likeButtonOnClick,
                  onDislikeClick: _this4.dislikeButtonOnClick,
                  onCancelClick: _this4.setNeutralButtonOnClick });
              })
            )
          )
        )
      );
    }
  }]);

  return Search;
}(_react2.default.Component);

exports.default = Search;