import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import BaseLayout from './layouts/BaseLayout';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render((
  <div id="app">
    <BrowserRouter>
      <BaseLayout />
    </BrowserRouter>
  </div>
), document.getElementById('root'));

registerServiceWorker();
