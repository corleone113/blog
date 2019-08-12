import React from 'react';
import { render, } from 'react-dom';
import Index from './containers/IndexPage';
import configureStore from './configureStore';
import { Provider, } from 'react-redux';
// const div = document.createElement('div');
// div.setAttribute('id', 'root');
// const old = document.getElementById('root');
// old && document.body.removeChild(old);
// document.body.appendChild(div);
const root = document.getElementById( 'root' );
const store = configureStore();
render( (
  <Provider store={store}>
    <Index />
  </Provider> ), root );
if ( module.hot && process.env.NODE_ENV !== 'production' ) {
  module.hot.accept();
}