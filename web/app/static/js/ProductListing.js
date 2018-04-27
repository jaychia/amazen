'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactPopup = require('react-popup');

var _reactPopup2 = _interopRequireDefault(_reactPopup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var keyword_colors = [[251, 147, 44], [203, 152, 48], [164, 157, 52], [133, 162, 57], [107, 167, 63], [87, 172, 68], [70, 177, 75], [57, 183, 81], [46, 189, 89]];

var ProductListing = function (_React$Component) {
  _inherits(ProductListing, _React$Component);

  function ProductListing() {
    _classCallCheck(this, ProductListing);

    var _this = _possibleConstructorReturn(this, (ProductListing.__proto__ || Object.getPrototypeOf(ProductListing)).apply(this, arguments));

    _this.keywordOnClick = _this.keywordOnClick.bind(_this);
    return _this;
  }

  _createClass(ProductListing, [{
    key: 'addTermPlot',
    value: function addTermPlot(rating_freq) {
      // SVG params
      var h = 150;
      var w = 600;
      var m = 20;
      var svg = d3.select(document.createElementNS('http://www.w3.org/2000/svg', 'svg')).attr("height", h + m).attr("width", w + m);
      // define scales and axis
      var xScale = d3.scaleOrdinal().domain(["1", "2", "3", "4", "5"]).range([0 + m, w / 5 + m, 2 * w / 5 + m, 3 * w / 5 + m, 4 * w / 5 + m]);

      var minNum = Math.exp(-3);
      var maxNum = 0;
      var adjs = -0.00001;
      var allEqual = function allEqual(arr) {
        return arr.every(function (v) {
          return v === arr[0];
        });
      };
      if (allEqual(rating_freq)) {
        rating_freq[0] += adjs;
      }

      rating_freq.forEach(function (val) {
        if (val < minNum && val > 0) {
          minNum = val;
        }
        if (val > maxNum) {
          maxNum = val;
        }
      });

      var yScale = d3.scaleLinear().domain([minNum, maxNum]).range([h - m, m]);

      var xAxis = d3.axisBottom(xScale);
      svg.append("g").attr("class", "axis axis--x").attr("transform", "translate(0," + h + ")").call(xAxis);
      // add points from user input in rating_freq
      var points = [];
      rating_freq.map(function (e, i) {
        points.push({ x: xScale(i + 1), y: yScale(e + Math.exp(-10)) });
      });
      // define line and area generators
      var lineGenerator = d3.line().x(function (d) {
        return d.x;
      }).y(function (d) {
        return d.y;
      }).curve(d3.curveCardinal);
      var area = d3.area().x(function (d) {
        return d.x;
      }).y0(h).y1(function (d) {
        return d.y;
      }).curve(d3.curveCardinal);
      // define fill/stroke gradient target
      var grad = svg.append("linearGradient").attr("id", "linGrad");
      var stop1 = grad.append("stop").attr("id", "stop1").attr("offset", "0%").attr("stop-color", "#f00000").attr("stop-opacity", "0.9");
      var stop2 = grad.append("stop").attr("id", "stop2").attr("offset", "100%").attr("stop-color", "#00aa3f");
      // append paths and area
      var pathData = lineGenerator(points);
      svg.append("path").data([points]).attr("class", "area").attr("d", area).style("fill", "url(#linGrad)").style("opacity", "0.3");
      svg.append('path').attr('d', pathData).attr("class", "path").style("stroke", "url(#linGrad)").style("stroke-width", 4).style("fill", "None");
      var doctype = '<?xml version="1.0" standalone="no"?>' + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
      var source = new XMLSerializer().serializeToString(svg.node());
      var blob = new Blob([doctype + source], { type: 'image/svg+xml;charset=utf-8' });
      var url = window.URL.createObjectURL(blob);
      var img = _react2.default.createElement('img', { src: url });
      return img;
    }
  }, {
    key: 'keywordOnClick',
    value: function keywordOnClick(word, score_list) {
      var img = this.addTermPlot(score_list);
      _reactPopup2.default.create({
        title: word,
        content: img,
        className: 'alert'
      }, true);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      // Render pric;
      var d = (this.props.price - Math.floor(this.props.price)).toString();
      var superscript_number = d.substring(2, 4);
      if (superscript_number.length == 0) superscript_number = "00";
      if (superscript_number.length == 1) superscript_number = superscript_number + "0";

      // Render description \n newlines by splitting into spans
      var desc_split = this.props.desc.split("\n").map(function (s) {
        return _react2.default.createElement(
          'span',
          { key: s },
          s
        );
      });

      // Render stars
      var rounded = Math.round(this.props.rating * 2) / 2;
      var stars = [].concat(_toConsumableArray(Array(Math.floor(rounded)).keys())).map(function (x) {
        return _react2.default.createElement('img', { src: '/static/img/fullstar.png', className: 'full-star' });
      });
      if (rounded % 1 != 0) {
        stars.push(_react2.default.createElement('img', { src: '/static/img/halfstar.png', className: 'half-star' }));
      }
      stars.push(_react2.default.createElement(
        'span',
        { key: this.props.numRatings, className: 'num-ratings' },
        this.props.numRatings
      ));

      var keywords = this.props.keywords.map(function (e, i) {
        return [e, _this2.props.keywordscores[i], _this2.props.keywordScoreList[i]];
      });
      var div = 5.0 / 8;
      var k2_to_div = function k2_to_div(k2) {
        var rgb = keyword_colors[Math.floor(k2[1] / div)];
        var rgb_str = 'rgb(' + rgb[0].toString() + "," + rgb[1].toString() + "," + rgb[2].toString() + ", 1" + ')';
        var colorStyle = { 'backgroundColor': rgb_str };
        return _react2.default.createElement(
          'button',
          { className: 'keyword', style: colorStyle, type: 'button', onClick: function onClick() {
              return _this2.keywordOnClick(k2[0], k2[2]);
            } },
          k2[0]
        );
      };
      var keyword_divs = keywords.map(k2_to_div);

      return _react2.default.createElement(
        'div',
        { className: 'product-listing-container' },
        _react2.default.createElement(_reactPopup2.default, null),
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
                'a',
                { href: "https://amazon.com/dp/" + this.props.asin },
                _react2.default.createElement(
                  'div',
                  { className: 'product-title' },
                  this.props.productTitle
                )
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
              _react2.default.createElement(
                'div',
                { className: 'product-keyword-dashboard' },
                _react2.default.createElement(
                  'div',
                  { className: 'star-panel' },
                  stars
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'star-panel-text' },
                  'Common keywords across all reviews:'
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'keywords-container' },
                  keyword_divs
                )
              )
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
  numRatings: _propTypes2.default.number,
  imgUrl: _propTypes2.default.string,
  asin: _propTypes2.default.string.isRequired
};