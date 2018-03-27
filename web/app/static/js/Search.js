"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Search = function (_React$Component) {
  _inherits(Search, _React$Component);

  function Search() {
    _classCallCheck(this, Search);

    return _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).apply(this, arguments));
  }

  _createClass(Search, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement("link", { rel: "stylesheet", href: "/static/bootstrap.min.css" }),
        _react2.default.createElement("link", { rel: "stylesheet", href: "/static/main.css" }),
        _react2.default.createElement(
          "div",
          { className: "topcorner" },
          _react2.default.createElement(
            "p",
            null,
            "Project Name: ",
            this.props.name
          ),
          _react2.default.createElement(
            "p",
            null,
            "Student Name: ",
            this.props.netid
          )
        ),
        _react2.default.createElement(
          "form",
          { className: "form-inline global-search" },
          _react2.default.createElement(
            "h1",
            { style: { fontSize: 55, fontFamily: 'Futura', color: '#4285F4' } },
            "C",
            _react2.default.createElement(
              "font",
              { color: "#EA4335" },
              "S"
            ),
            _react2.default.createElement(
              "font",
              { color: "#FBBC05" },
              "4"
            ),
            "3",
            _react2.default.createElement(
              "font",
              { color: "#34A853" },
              "0"
            ),
            _react2.default.createElement(
              "font",
              { color: "#EA4335" },
              "0"
            )
          ),
          _react2.default.createElement("br", null),
          _react2.default.createElement("br", null),
          _react2.default.createElement(
            "div",
            { className: "form-group" },
            _react2.default.createElement("input", { id: "input", type: "text", name: "search", className: "form-control", placeholder: "Your Input" })
          ),
          _react2.default.createElement(
            "button",
            { type: "submit", className: "btn btn-info" },
            " Go! "
          )
        )
      );
    }
  }]);

  return Search;
}(_react2.default.Component);

exports.default = Search;