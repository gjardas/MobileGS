import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './index.css'; // Opcional, se você tiver outros estilos globais aqui
// import reportWebVitals from './reportWebVitals'; // Opcional

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Se você usa reportWebVitals para medir performance
// reportWebVitals();
