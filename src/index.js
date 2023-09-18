import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// import { FornecedorProvider } from './components/FornecedorContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <FornecedorProvider>
        <App />
    // </FornecedorProvider>
);
