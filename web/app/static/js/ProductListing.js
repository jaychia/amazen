'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProductListing = function (_React$Component) {
  _inherits(ProductListing, _React$Component);

  function ProductListing() {
    _classCallCheck(this, ProductListing);

    return _possibleConstructorReturn(this, (ProductListing.__proto__ || Object.getPrototypeOf(ProductListing)).apply(this, arguments));
  }

  _createClass(ProductListing, [{
    key: 'render',
    value: function render() {
      console.log("GLOBAL: query=" + query + "\n desc=" + descriptors);
      var superscript_number = this.props.price % 1 < 10 ? (this.props.price % 1).toString() + "0" : this.props.price % 1;
      var desc_split = this.props.desc.split("\n").map(function (s) {
        return _react2.default.createElement(
          'span',
          null,
          s,
          _react2.default.createElement('br', null)
        );
      });
      return _react2.default.createElement(
        'div',
        { className: 'product-listing-container' },
        _react2.default.createElement(
          'div',
          { className: 'product-listing' },
          _react2.default.createElement(
            'div',
            { className: 'product-img-container' },
            _react2.default.createElement('img', { className: 'product-img', src: this.props.imgUrl })
          ),
          _react2.default.createElement(
            'div',
            { className: 'product-main' },
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                'div',
                { className: 'product-title' },
                this.props.productTitle
              ),
              _react2.default.createElement(
                'div',
                { className: 'product-seller' },
                this.props.seller
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'product-listing-body' },
              _react2.default.createElement(
                'div',
                { className: 'product-body-left' },
                _react2.default.createElement(
                  'div',
                  { className: 'product-price' },
                  _react2.default.createElement(
                    'span',
                    { className: 'product-price-big' },
                    "$" + Math.floor(this.props.price).toString()
                  ),
                  _react2.default.createElement(
                    'span',
                    { className: 'product-price-superscript' },
                    superscript_number
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'product-desc' },
                  desc_split
                )
              ),
              _react2.default.createElement('div', { className: 'product-keyword-dashboard' })
            )
          )
        ),
        _react2.default.createElement('div', { className: 'product-divider' })
      );
    }
  }]);

  return ProductListing;
}(_react2.default.Component);

exports.default = ProductListing;


ProductListing.propTypes = {
  productTitle: _propTypes2.default.string.isRequired,
  price: _propTypes2.default.number.isRequired,
  seller: _propTypes2.default.string.isRequired,
  desc: _propTypes2.default.string,
  keywords: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
  keywordscores: _propTypes2.default.arrayOf(_propTypes2.default.number).isRequired,
  rating: _propTypes2.default.number,
  imgUrl: _propTypes2.default.string
};