'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ProductListing = require('./ProductListing.jsx');

var _ProductListing2 = _interopRequireDefault(_ProductListing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ptitle = "HP 8300 Elite Small Form Factor Desktop Computer, Intel Core i5-3470 3.2GHz Quad-Core, 8GB RAM, 500GB SATA, Windows 10 Pro 64-Bit, USB 3.0, Display Port (Certified Refurbished)";
var price = 40.0;

_reactDom2.default.render(_react2.default.createElement(_ProductListing2.default, { productTitle: ptitle, price: price }), document.getElementById('root'));