import React from 'react';
import ReactDOM from 'react-dom';
import ProductListing from './ProductListing.jsx';

let ptitle = "HP 8300 Elite Small Form Factor Desktop Computer, Intel Core i5-3470 3.2GHz Quad-Core, 8GB RAM, 500GB SATA, Windows 10 Pro 64-Bit, USB 3.0, Display Port (Certified Refurbished)";
let price = 40.0;
let seller = "Chalrles Bailon";// PropTypes.string.isRequired,
let desc = "Deal: Biggest deal ever \n Make me happy: oh shit\nNo drawbacks: really sic";// PropTypes.string,
let keywords = ["Hot", "Steamy", "Cute", "Smoking", "Lol", "Keyword"];// PropTypes.arrayOf(PropTypes.string).isRequired,
let keywordscores = [4.0, 3.0, 2.5, 1.5, 5.0, 4.5]; // PropTypes.arrayOf(PropTypes.number).isRequired,
let rating = 4.0;// PropTypes.number
// let img = "https://media.licdn.com/dms/image/C5603AQEApkGEbFQMJw/profile-displayphoto-shrink_800_800/0?e=1528956000&v=beta&t=kOtxa0-7FomSHErGmHV0i7h78tO3J7I5mpzM6qN1WtE";
let img = "https://www.telegraph.co.uk/content/dam/Travel/hotels/europe/france/paris/eiffel-tower-paris-p.jpg?imwidth=480";


ReactDOM.render(<ProductListing 
    productTitle={ptitle} 
    price={price} 
    seller={seller} 
    desc={desc} 
    keywords={keywords} 
    keywordscores={keywordscores} 
    rating={rating}
    imgUrl={img} />, document.getElementById('root'));