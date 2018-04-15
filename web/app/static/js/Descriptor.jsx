import React from 'react';

export default class Descriptor extends React.Component {
  props: {
    name: string,
    buttonOnClick: () => void,
  };

  render() {
    return (
      <div>
        <link rel="stylesheet" href="/static/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/static/main.css" />
      </div>
    );
  }
}
