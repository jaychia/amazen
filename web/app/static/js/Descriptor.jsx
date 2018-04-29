import React from 'react';
import PropTypes from 'prop-types';

export default class Descriptor extends React.Component {
  constructor() {
    super(...arguments);
  }

  render() {
    if (this.props.status == "NEUTRAL") {
      return (
        <div className="desc-tag">
          <button className="card card-1" type="button" onClick={() => this.props.onDislikeClick(this.props.text)}>
            <img className="thumbs" src="static/img/thumb-down.png"></img>
          </button>
          <span className="desc-tag-text card card-2">
            {this.props.text}
          </span>
          <button className="card card-1" type="button" onClick={() => this.props.onLikeClick(this.props.text)}>
            <img className="thumbs" src="static/img/thumb-up.png"></img>
          </button>
        </div>
      );
    } else if (this.props.status == "UP") {
      return(
      <span className="card card-1 desc-tag up" onClick={() => this.props.onCancelClick(this.props.text)}>
        {this.props.text}
      </span>);
    } else if (this.props.status == "DOWN") {
      return(
        <span className="card card-1 desc-tag down" onClick={() => this.props.onCancelClick(this.props.text)}>
        {this.props.text}
      </span>);
    }
  }
}

Descriptor.propTypes = {
  text: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  onLikeClick: PropTypes.func,
  onDislikeClick: PropTypes.func,
  onCancelClick: PropTypes.func
};