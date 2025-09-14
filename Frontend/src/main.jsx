import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { persistReduxStore } from './store';

createRoot(document.getElementById('root')).render(
  <Provider store={persistReduxStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </Provider>
);