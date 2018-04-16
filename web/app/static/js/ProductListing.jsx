import React from 'react';
import PropTypes from 'prop-types';

const keyword_colors = [[251, 147, 44], [203, 152, 48], [164, 157, 52], [133, 162, 57], [107, 167, 63], [87, 172, 68], [70, 177, 75], [57, 183, 81], [46, 189, 89]];

export default class ProductListing extends React.Component {
  constructor() {
    super(...arguments);
  }
  
  render() {
    // Render price
    let superscript_number = (this.props.price % 1 < 10) ? 
      (this.props.price % 1).toString() + "0" : this.props.price % 1;

    // Render description \n newlines by splitting into spans
    let desc_split = this.props.desc.split("\n").map((s) => <span>{s}</span>);

    // Render stars
    let rounded = (Math.round(this.props.rating * 2) / 2);
    let stars = [...Array(Math.floor(rounded)).keys()].map((x) => <img src="/static/img/fullstar.png" className="full-star" />);
    if (rounded % 1 != 0) { stars.push(<img src="/static/img/halfstar.png" className="half-star" />);}
    stars.push(<span key={this.props.numRatings} className="num-ratings">{this.props.numRatings}</span>)

    let keywords = this.props.keywords.map((e, i) => [e, this.props.keywordscores[i]]);
    let div = 5.0 / 8;
    let k2_to_div = (k2) => {
      let rgb = keyword_colors[Math.floor(k2[1] / div)];
      let rgb_str = 'rgb(' + rgb[0].toString() + "," + rgb[1].toString() + "," + rgb[2].toString() + ", 1" + ')';
      let colorStyle = {'backgroundColor': rgb_str};
      return <div className="keyword" style={colorStyle}>{k2[0]}</div>
    }
    let keyword_divs = keywords.map(k2_to_div);

    return (
      <div className="product-listing-container">
        <div className="product-listing">
          <div className="product-img-container">
            <img className="product-img" src={this.props.imgUrl}/>
          </div>
          <div className="product-main">
            <div>
              <div className="product-title">
                {this.props.productTitle}
              </div>
              <div className="product-seller">
                {this.props.seller}
              </div>
            </div>
            <div className="product-listing-body">
              <div className="product-body-left">
                <div className="product-price">
                  <span className="product-price-big">{"$"+Math.floor(this.props.price).toString()}</span>
                  <span className="product-price-superscript">{superscript_number}</span>
                </div>
                <div className="product-desc">
                  {desc_split}
                </div>
              </div>
              <div className="product-keyword-dashboard">
                <div className="star-panel">{stars}</div>
                <span className="star-panel-text">Common keywords across all reviews:</span>
                <div className="keywords-container">{keyword_divs}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="product-divider" />
      </div>
    );
  }
}

ProductListing.propTypes = {
  productTitle: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  seller: PropTypes.string.isRequired,
  desc: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
  keywordscores: PropTypes.arrayOf(PropTypes.number).isRequired,
  rating: PropTypes.number,
  numRatings: PropTypes.number,
  imgUrl: PropTypes.string,
};