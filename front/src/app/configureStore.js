import {
    createStore,
    applyMiddleware
} from 'redux';
import rootReducer from './reducers';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}) {
    const store = createStore(rootReducer, initialState,applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(rootSaga);
    if (module.hot && process.env.NODE_ENV !== 'production') {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers', () => {
            const nextRootReducer = require('./reducers/index');
            store.replaceReducer(nextRootReducer);
        });
    }
    return store;
}