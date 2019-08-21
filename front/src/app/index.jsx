import React from 'react';
import { render, } from 'react-dom';
import Index from './containers/IndexPage';
import configureStore from './configureStore';
import { Provider, } from 'react-redux';
const root = document.getElementById('root');
const store = configureStore();
render((
  <Provider store={store}>
    <Index />
  </Provider>), root);
if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}