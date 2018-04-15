import React from 'react';
import ReactDOM from 'react-dom';
import ProductListing from './ProductListing.jsx';

let ptitle = "HP 8300 Elite Small Form Factor Desktop Computer, Intel Core i5-3470 3.2GHz Quad-Core, 8GB RAM, 500GB SATA, Windows 10 Pro 64-Bit, USB 3.0, Display Port (Certified Refurbished)";
let price = 40.0

ReactDOM.render(<ProductListing productTitle={ptitle} price={price} />, document.getElementById('root'));