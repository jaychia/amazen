'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ResultPage = require('./ResultPage.jsx');

var _ResultPage2 = _interopRequireDefault(_ResultPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Note: Every field is required. If there's nothing in that field, use an empty string.
var ptitle = ["HP 8300 Elite Small Form Factor Desktop Computer, Intel Core i5-3470 3.2GHz Quad-Core, 8GB RAM, 500GB SATA, Windows 10 Pro 64-Bit, USB 3.0, Display Port (Certified Refurbished)", "Razer Blade Ultra-Thin Gaming Laptop - 14 Full HD(Core i7 - 7700HQ, 16GB RAM, 512TB SSD, GeForce GTX 1060) - VR Ready"];
var price = [40.0, 888.0];
var seller = ["Chalrles Bailon", "Peter Cortle"]; // PropTypes.string.isRequired,
var desc = ["Deal: Biggest deal ever \n Make me happy: oh shit\nNo drawbacks: really sic", "Deal: The deal ever \n Make me happy: oh shit\nNo drawbacks: really sic"]; // PropTypes.string,
var keywords = [["Hot", "Steamy", "Cute", "Smoking", "Lol", "Keyword"], ["Hot", "Steamy", "Cute", "Smoking", "Lol", "Keyword"]]; // PropTypes.arrayOf(PropTypes.string).isRequired,
var keywordscores = [[4.0, 3.0, 2.5, 1.5, 5.0, 4.5], [5.0, 5.0, 2.5, 1.5, 1.0, 4.5]]; // PropTypes.arrayOf(PropTypes.number).isRequired,
var rating = [4.4, 3.8]; // PropTypes.number
// let img = "https://media.licdn.com/dms/image/C5603AQEApkGEbFQMJw/profile-displayphoto-shrink_800_800/0?e=1528956000&v=beta&t=kOtxa0-7FomSHErGmHV0i7h78tO3J7I5mpzM6qN1WtE";
var img = ["https://www.telegraph.co.uk/content/dam/Travel/hotels/europe/france/paris/eiffel-tower-paris-p.jpg?imwidth=480", "https://images-na.ssl-images-amazon.com/images/I/31vyQTirHdL._AC_US218_.jpg"];
var numRatings = [587, 888];

_reactDom2.default.render(_react2.default.createElement(_ResultPage2.default, {
    query: query,
    descriptors: descriptors,
    productTitle: ptitle,
    price: price,
    seller: seller,
    desc: desc,
    keywords: keywords,
    keywordscores: keywordscores,
    rating: rating,
    imgUrl: img,
    numRatings: numRatings }), document.getElementById('root'));