import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext'; // ← import
import { ToastProvider } from './context/ToastContext'; // ← import


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider> {/* ← wrap App in context */}
      <AuthProvider> {/* ← wrap App in context */}
        <App />
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
