import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import "simplebar/src/simplebar.css";
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
