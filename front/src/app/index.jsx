import React from 'react';
import loadable from '@loadable/component';
import { render, } from 'react-dom';
import configureStore from './configureStore';
import { Provider, } from 'react-redux';
const root = document.getElementById('root');
const store = configureStore();
const Index = loadable(() => import('./containers/IndexPage'));
render((
  <Provider store={store}>
    <Index />
  </Provider>), root);
if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}