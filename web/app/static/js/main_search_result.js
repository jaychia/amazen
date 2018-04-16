'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ResultPage = require('./ResultPage.jsx');

var _ResultPage2 = _interopRequireDefault(_ResultPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(_ResultPage2.default, {
    query: query,
    descriptors: descriptors
}), document.getElementById('root'));