import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './components/app/app';
import './assets/styles/index.css';
import 'antd/dist/antd.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
