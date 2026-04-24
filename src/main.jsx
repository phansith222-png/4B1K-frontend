import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; 
import { SocketProvider } from './contexts/SocketContext';
import { CyberToastProvider } from './components/CyberToast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CyberToastProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </CyberToastProvider>
  </React.StrictMode>
);
