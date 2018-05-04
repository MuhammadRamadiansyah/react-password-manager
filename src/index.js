import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'mobx-react'
import UserStore from './stores/UserStore'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider UserStore={UserStore}>
    <App />
  </Provider>
, document.getElementById('root'));
registerServiceWorker();
