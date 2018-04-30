import React from 'react';
import PropTypes from 'prop-types';
import Popup from 'react-popup';

const keyword_colors = [[251, 147, 44], [203, 152, 48], [164, 157, 52], [133, 162, 57], [107, 167, 63], [87, 172, 68], [70, 177, 75], [57, 183, 81], [46, 189, 89]];

export default class ProductListing extends React.Component {
  constructor() {
    super(...arguments);
    this.keywordOnClick = this.keywordOnClick.bind(this);
  }

  addTermPlot(rating_freq, sentence) {
    // SVG params
    var h = 150;
    var w = 600;
    var m = 20
    var svg = d3.select(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
      .attr("height", h + m)
      .attr("width", w + m);
    // define scales and axis
    var xScale = d3.scaleOrdinal()
      .domain(["1", "2", "3", "4", "5"])
      .range([0 + m, w / 5 + m, 2 * w / 5 + m, 3 * w / 5 + m, 4 * w / 5 + m]);

    var minNum = Math.exp(-3)
    var maxNum = 0
    var adjs = -0.00001
    const allEqual = arr => arr.every(v => v === arr[0])
    if (allEqual(rating_freq)) {
      rating_freq[0] += adjs
    }

    rating_freq.forEach(function (val) {
      if (val < minNum && val > 0) {
        minNum = val
      }
      if (val > maxNum) {
        maxNum = val
      }
    });

    var yScale = d3.scaleLinear()
      .domain([minNum, maxNum])
      .range([h - m, m]);


    var xAxis = d3.axisBottom(xScale);
    svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + (h) + ")")
      .call(xAxis);
    // add points from user input in rating_freq
    var points = []
    rating_freq.map((e, i) => {
      points.push({ x: xScale(i + 1), y: yScale(e + Math.exp(-10)) });
    });
    // define line and area generators
    var lineGenerator = d3.line()
      .x(function (d) { return d.x; })
      .y(function (d) { return d.y; })
      .curve(d3.curveCardinal);
    var area = d3.area()
      .x(function (d) { return d.x; })
      .y0(h)
      .y1(function (d) { return d.y; })
      .curve(d3.curveCardinal);
    // define fill/stroke gradient target
    var grad = svg.append("linearGradient")
      .attr("id", "linGrad");
    var stop1 = grad.append("stop")
      .attr("id", "stop1")
      .attr("offset", "0%")
      .attr("stop-color", "#f00000")
      .attr("stop-opacity", "0.9");
    var stop2 = grad.append("stop")
      .attr("id", "stop2")
      .attr("offset", "100%")
      .attr("stop-color", "#00aa3f");
    // append paths and area
    var pathData = lineGenerator(points);
    svg.append("path")
      .data([points])
      .attr("class", "area")
      .attr("d", area)
      .style("fill", "url(#linGrad)")
      .style("opacity", "0.3");
    svg.append('path')
      .attr('d', pathData)
      .attr("class", "path")
      .style("stroke", "url(#linGrad)")
      .style("stroke-width", 4)
      .style("fill", "None");
    var doctype = '<?xml version="1.0" standalone="no"?>'
      + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
    var source = (new XMLSerializer()).serializeToString(svg.node());
    var blob = new Blob([doctype + source], { type: 'image/svg+xml;charset=utf-8' });
    var url = window.URL.createObjectURL(blob);
    var img = <img src={url} />;
    var div = 
      <div>
        {img}
        <div className="popup-sent">{sentence}</div>
      </div>;
    return div;
  } 

  keywordOnClick(word, score_list, sentence) {
    let img = this.addTermPlot(score_list, sentence);
    Popup.create({
      title: word,
      content: img,
      className: 'alert',
    }, true);
  }

  render() {
    // Render pric;
    let d = (this.props.price - Math.floor(this.props.price)).toString();
    let superscript_number = d.substring(2,4);
    if (superscript_number.length == 0)
      superscript_number = "00";
    if (superscript_number.length == 1)
      superscript_number = superscript_number + "0";

    // Render description \n newlines by splitting into spans
    let desc_split = this.props.desc.split("\n").map((s) => <span key={s}>{s}</span>);

    // Render stars
    let rounded = (Math.round(this.props.rating * 2) / 2);
    let stars = [...Array(Math.floor(rounded)).keys()].map((x) => <img src="/static/img/fullstar.png" className="full-star" />);
    if (rounded % 1 != 0) { stars.push(<img src="/static/img/halfstar.png" className="half-star" />);}
    stars.push(<span key={this.props.numRatings} className="num-ratings">{this.props.numRatings}</span>)

    let keywords = this.props.keywords.map((e, i) => [e, this.props.keywordscores[i], this.props.keywordScoreList[i], this.props.keywordsSents[i]]);
    let div = 5.0 / 8;
    let k2_to_div = (k2) => {
      let rgb = keyword_colors[Math.floor(k2[1] / div)];
      let rgb_str = 'rgb(' + rgb[0].toString() + "," + rgb[1].toString() + "," + rgb[2].toString() + ", 1" + ')';
      let colorStyle = {'backgroundColor': rgb_str};
      return <button className="keyword" style={colorStyle} type="button" onClick={() => this.keywordOnClick(k2[0], k2[2], k2[3])}>{k2[0]}</button>
    }
    let keyword_divs = keywords.map(k2_to_div);
    let descriptors_review_num = this.props.descriptors_review_num;

    return (
      <div className="product-listing-container">
        <Popup />
        <div className="product-listing">
          <div className="product-img-container">
            <img className="product-img" src={this.props.imgUrl}/>
          </div>
          <div className="product-main">
            <div>
              <a href={"https://amazon.com/dp/" + this.props.asin}>
                <div className="product-title">
                  {this.props.productTitle}
                </div>
              </a>
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
                <div className="product-descriptors">
                  <span>Descriptor Counts:</span>
                  <br />
                  {this.props.descriptors.map(function (w, i) {
                    return (
                      <div>
                        <span>{w}: {descriptors_review_num[i]}</span>
                        <br />
                      </div>
                    )
                  })}
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
  descriptors: PropTypes.arrayOf(PropTypes.string).isRequired,
  descriptors_review_num: PropTypes.arrayOf(PropTypes.string).isRequired,
  keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
  keywordscores: PropTypes.arrayOf(PropTypes.number).isRequired,
  rating: PropTypes.number,
  numRatings: PropTypes.number,
  imgUrl: PropTypes.string,
  asin: PropTypes.string.isRequired
};