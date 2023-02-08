import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import GlobalSyles from './components/GlobalStyles';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

ReactDOM.render(
    <Provider store={store}>
        {/* <React.StrictMode> */}
        <GlobalSyles>
            <App className="app" />
        </GlobalSyles>
        {/* </React.StrictMode> */}
    </Provider>,
    document.getElementById('root'),
);
