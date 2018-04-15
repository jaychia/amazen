import React from 'react';
import PropTypes from 'prop-types'

export default class ProductListing extends React.Component {
  constructor() {
    super(...arguments);
  }
  
  render() {
    return (
      <div className="productlisting">
        PRODUCTLISTING { query } { descriptors } {this.props.productTitle} {this.props.price}
      </div>
    );
  }
}

ProductListing.propTypes = {
  productTitle: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired
};