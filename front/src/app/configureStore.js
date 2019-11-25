import {
    createStore,
    applyMiddleware,
} from 'redux';
import rootReducer from './reducers';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
const sagaMiddleware = createSagaMiddleware();


export default function configureStore(initialState = {}) {
    let store;
    const getNewStore = (reducer, saga) => {
        store = createStore(reducer, initialState, applyMiddleware(sagaMiddleware));
        sagaMiddleware.run(saga);
    };
    getNewStore(rootReducer, rootSaga);
    if (module.hot && process.env.NODE_ENV !== 'production') {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept(['./sagas', './reducers', ], () => {
            const nextRootReducer = require('./reducers');
            const nextSaga = require('./sagas');
            getNewStore(nextRootReducer, nextSaga);
        });
    }
    return store;
}