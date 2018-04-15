import React from 'react';
import PropTypes from 'prop-types'

export default class ProductListing extends React.Component {
  constructor() {
    super(...arguments);
  }
  
  render() {
    console.log("GLOBAL: query=" + query + "\n desc=" + descriptors);
    let superscript_number = (this.props.price % 1 < 10) ? 
      (this.props.price % 1).toString() + "0" : this.props.price % 1;
    let desc_split = this.props.desc.split("\n").map((s) => <span>{s}<br /></span>);
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
  imgUrl: PropTypes.string,
};