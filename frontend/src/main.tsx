import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    '[main] Could not find #root element. Check your index.html.',
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
