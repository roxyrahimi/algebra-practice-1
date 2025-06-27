import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';   // this one is built-in Vite styling
import './App.css';     // ✅ THIS LINE is critical

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


