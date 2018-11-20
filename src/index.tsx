import React from 'react';
import ReactDOM from 'react-dom';
import './global.scss';
import './index.scss';
import App from './App';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service-worker.js');
    });
  }

ReactDOM.render(<App />, document.getElementById('root'));
