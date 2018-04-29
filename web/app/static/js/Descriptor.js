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

var Descriptor = function (_React$Component) {
  _inherits(Descriptor, _React$Component);

  function Descriptor() {
    _classCallCheck(this, Descriptor);

    return _possibleConstructorReturn(this, (Descriptor.__proto__ || Object.getPrototypeOf(Descriptor)).apply(this, arguments));
  }

  _createClass(Descriptor, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (this.props.status == "NEUTRAL") {
        return _react2.default.createElement(
          'div',
          { className: 'desc-tag' },
          _react2.default.createElement(
            'button',
            { className: 'card card-1', type: 'button', onClick: function onClick() {
                return _this2.props.onDislikeClick(_this2.props.text);
              } },
            _react2.default.createElement('img', { className: 'thumbs', src: 'static/img/thumb-down.png' })
          ),
          _react2.default.createElement(
            'span',
            { className: 'desc-tag-text card card-2' },
            this.props.text
          ),
          _react2.default.createElement(
            'button',
            { className: 'card card-1', type: 'button', onClick: function onClick() {
                return _this2.props.onLikeClick(_this2.props.text);
              } },
            _react2.default.createElement('img', { className: 'thumbs', src: 'static/img/thumb-up.png' })
          )
        );
      } else if (this.props.status == "UP") {
        return _react2.default.createElement(
          'span',
          { className: 'card card-1 desc-tag up', onClick: function onClick() {
              return _this2.props.onCancelClick(_this2.props.text);
            } },
          this.props.text
        );
      } else if (this.props.status == "DOWN") {
        return _react2.default.createElement(
          'span',
          { className: 'card card-1 desc-tag down', onClick: function onClick() {
              return _this2.props.onCancelClick(_this2.props.text);
            } },
          this.props.text
        );
      }
    }
  }]);

  return Descriptor;
}(_react2.default.Component);

exports.default = Descriptor;


Descriptor.propTypes = {
  text: _propTypes2.default.string.isRequired,
  status: _propTypes2.default.string.isRequired,
  onLikeClick: _propTypes2.default.func,
  onDislikeClick: _propTypes2.default.func,
  onCancelClick: _propTypes2.default.func
};