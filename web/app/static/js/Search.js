"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Search = function (_React$Component) {
  _inherits(Search, _React$Component);

  function Search() {
    _classCallCheck(this, Search);

    var _this = _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).apply(this, arguments));

    _this.state = { descriptors: [] };
    _this.buttonOnClick = _this.buttonOnClick.bind(_this);
    return _this;
  }

  _createClass(Search, [{
    key: "buttonOnClick",
    value: function buttonOnClick() {
      var _this2 = this;

      if (this.refs.New_descriptor.value != "") this.setState(function (prevState, props) {
        return {
          descriptors: [].concat(_toConsumableArray(prevState.descriptors), [_this2.refs.New_descriptor.value])
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement("link", { rel: "stylesheet", href: "/static/css/bootstrap.min.css" }),
        _react2.default.createElement("link", { rel: "stylesheet", href: "/static/css/bootstrap-grid.min.css" }),
        _react2.default.createElement("link", { rel: "stylesheet", href: "/static/css/bootstrap-reboot.min.css" }),
        _react2.default.createElement("link", { rel: "stylesheet", href: "/static/main.css" }),
        _react2.default.createElement(
          "div",
          { className: "text-center" },
          _react2.default.createElement("img", { src: "/static/img/logo.png", width: "400" })
        ),
        _react2.default.createElement(
          "form",
          { className: "form-inline global-search" },
          _react2.default.createElement(
            "div",
            { className: "search-bar" },
            _react2.default.createElement("input", { id: "search_btn", type: "text", className: "input-lg", placeholder: "What are you looking for today?" }),
            _react2.default.createElement(
              "div",
              { className: "input-group-btn" },
              _react2.default.createElement(
                "button",
                { className: "btn btn-lg", type: "button" },
                _react2.default.createElement("span", { className: "glyphicon glyphicon-search" })
              )
            )
          ),
          _react2.default.createElement("br", null),
          _react2.default.createElement(
            "div",
            { className: "search-bar descriptor-bar" },
            _react2.default.createElement("input", { type: "text", className: "input-lg", placeholder: "Descriptors", ref: "New_descriptor" }),
            _react2.default.createElement(
              "div",
              { className: "input-group-btn" },
              _react2.default.createElement(
                "button",
                { className: "btn btn-lg", type: "button", onClick: this.buttonOnClick },
                _react2.default.createElement("span", { className: "glyphicon glyphicon-plus" })
              )
            )
          )
        ),
        _react2.default.createElement(
          "ul",
          null,
          this.state.descriptors.map(function (message) {
            return _react2.default.createElement(
              "li",
              { key: message },
              message
            );
          })
        )
      );
    }
  }]);

  return Search;
}(_react2.default.Component);

exports.default = Search;