import React from 'react';
import PropTypes from 'prop-types';

export default class Descriptor extends React.Component {
  constructor() {
    super(...arguments);
  }

  render() {
    return (
    <span>
      {this.props.text}
    </span>
    );
  }
}

Descriptor.propTypes = {
  text: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  onLikeClick: PropTypes.func,
  onDislikeClick: PropTypes.func,
  onCancelClick: PropTypes.func
};