import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import BaseLayout from './layouts/BaseLayout';
import Pages from './pages';
import registerServiceWorker from './registerServiceWorker';
import { store } from './helpers';
import './index.css';

const { LoginPage } = Pages;

ReactDOM.render((
  <div id="app">
    <Provider store={store}>
      <BrowserRouter>
        <Switch >
          <Route path="/login" exact component={ LoginPage } />
          <Route path="/*" exact component={ BaseLayout } />
        </Switch>
      </BrowserRouter>
    </Provider>
  </div>
), document.getElementById('root'));

registerServiceWorker();
