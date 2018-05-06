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
import moment from 'moment';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { LocaleProvider } from 'antd';

moment.locale('zh-cn');

const { LoginPage } = Pages;

ReactDOM.render((
  <LocaleProvider locale={zh_CN}>
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
  </LocaleProvider>
), document.getElementById('root'));

registerServiceWorker();
