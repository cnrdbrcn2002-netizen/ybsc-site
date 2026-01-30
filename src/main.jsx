import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { OperativeProvider } from './context/OperativeContext';
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <OperativeProvider>
        <App />
      </OperativeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
