import React from 'react';
import loadable, { loadableReady, } from '@loadable/component';
import { hydrate, } from 'react-dom';
import configureStore from './configureStore';
import { Provider, } from 'react-redux';

const root = document.getElementById('root');
let initState = {};
if (typeof window !== 'undefined' && window.ssrState) {
  if (!ssrState.front.tags.user)
    sessionStorage.clear();
  initState = window.ssrState;
}
const store = configureStore(initState);
const Index = loadable(() => import('./containers/IndexPage'));
loadableReady(() => {
  hydrate((
    <Provider store={store}>
      <Index />
    </Provider>), root);
});
if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}