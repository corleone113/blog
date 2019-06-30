import { hot } from 'react-hot-loader/root';
import React from 'react';
import { render } from 'react-dom'
import Home from './component/home' 
import { Provider } from 'react-redux'
const div = document.createElement('div');
div.setAttribute('id', 'root');
const old = document.getElementById('root');
old && document.body.removeChild(old);
document.body.appendChild(div);
const root = document.getElementById('root');
const Home_ = hot(Home);
render(<Home_ />, root);
if (module.hot && process.env.NODE_ENV != 'production') {
    console.log('the node_env:', process.env.NODE_ENV);
    module.hot.accept();
}