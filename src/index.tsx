import React from 'react';
import ReactDOM from 'react-dom';
import './global.scss';
import './index.scss';
import App from './App';

/** Lets try this for now - disables service workers */
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
   registration.unregister()
 } })

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function() {
//       navigator.serviceWorker.register('/service-worker.js');
//     });
//   }

ReactDOM.render(<App />, document.getElementById('root'));
