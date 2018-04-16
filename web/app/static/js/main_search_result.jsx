import React from 'react';
import ReactDOM from 'react-dom';
import ResultPage from './ResultPage.jsx';

ReactDOM.render(<ResultPage
    query={query}
    descriptors={descriptors} 
    />, document.getElementById('root'));