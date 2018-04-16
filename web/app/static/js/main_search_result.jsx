import React from 'react';
import ReactDOM from 'react-dom';
import ResultPage from './ResultPage.jsx';

// Note: Every field is required. If there's nothing in that field, use an empty string.
let ptitle = ["HP 8300 Elite Small Form Factor Desktop Computer, Intel Core i5-3470 3.2GHz Quad-Core, 8GB RAM, 500GB SATA, Windows 10 Pro 64-Bit, USB 3.0, Display Port (Certified Refurbished)", "Razer Blade Ultra-Thin Gaming Laptop - 14 Full HD(Core i7 - 7700HQ, 16GB RAM, 512TB SSD, GeForce GTX 1060) - VR Ready"];
let price = [40.0, 888.0];
let seller = ["Chalrles Bailon", "Peter Cortle"];// PropTypes.string.isRequired,
let desc = ["Deal: Biggest deal ever \n Make me happy: oh shit\nNo drawbacks: really sic", "Deal: The deal ever \n Make me happy: oh shit\nNo drawbacks: really sic"];// PropTypes.string,
let keywords = [["Hot", "Steamy", "Cute", "Smoking", "Lol", "Keyword"], ["Hot", "Steamy", "Cute", "Smoking", "Lol", "Keyword"]];// PropTypes.arrayOf(PropTypes.string).isRequired,
let keywordscores = [[4.0, 3.0, 2.5, 1.5, 5.0, 4.5], [5.0, 5.0, 2.5, 1.5, 1.0, 4.5]]; // PropTypes.arrayOf(PropTypes.number).isRequired,
let rating = [4.4, 3.8];// PropTypes.number
// let img = "https://media.licdn.com/dms/image/C5603AQEApkGEbFQMJw/profile-displayphoto-shrink_800_800/0?e=1528956000&v=beta&t=kOtxa0-7FomSHErGmHV0i7h78tO3J7I5mpzM6qN1WtE";
let img = ["https://www.telegraph.co.uk/content/dam/Travel/hotels/europe/france/paris/eiffel-tower-paris-p.jpg?imwidth=480", "https://images-na.ssl-images-amazon.com/images/I/31vyQTirHdL._AC_US218_.jpg"];
let numRatings = [587, 888];
console.log(query);

ReactDOM.render(<ResultPage
    query={query}
    descriptors={descriptors}
    productTitle={ptitle} 
    price={price} 
    seller={seller} 
    desc={desc} 
    keywords={keywords} 
    keywordscores={keywordscores} 
    rating={rating}
    imgUrl={img}
    numRatings={numRatings} />, document.getElementById('root'));