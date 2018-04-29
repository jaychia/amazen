import React from 'react';
import ReactDOM from 'react-dom';
import ResultPage from './ResultPage.jsx';

ReactDOM.render(<ResultPage
    query={query}
    positive={positive}
    negative={negative}
    />, document.getElementById('root'));