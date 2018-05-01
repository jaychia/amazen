import React from 'react';
import PropTypes from 'prop-types';

export default class Descriptor extends React.Component {
  constructor() {
    super(...arguments);
  }

  render() {
    if (this.props.status == "NEUTRAL") {
      if (this.props.mutable) {
        return (
          <div className="desc-tag">
            <button className="card card-1 card-left" type="button" onClick={() => {this.props.onDislikeClick(this.refs.text.value); this.refs.text.value = "";}}>
              <img className="thumbs" src="static/img/thumb-down.png"></img>
            </button>
            <input className="desc-tag-text card card-2" ref="text" placeholder={this.props.text}>
            </input>
            <button className="card card-1 card-right" type="button" onClick={() => {this.props.onLikeClick(this.refs.text.value); this.refs.text.value = "";}}>
              <img className="thumbs" src="static/img/thumb-up.png"></img>
            </button>
          </div>
        );
      } else {
      return (
        <div className="desc-tag">
          <button className="card card-1 card-left" type="button" onClick={() => this.props.onDislikeClick(this.props.text)}>
            <img className="thumbs" src="static/img/thumb-down.png"></img>
          </button>
          <span className="desc-tag-text card card-2">
            {this.props.text}
          </span>
          <button className="card card-1 card-right" type="button" onClick={() => this.props.onLikeClick(this.props.text)}>
            <img className="thumbs" src="static/img/thumb-up.png"></img>
          </button>
        </div>
      );
    }
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