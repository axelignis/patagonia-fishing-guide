import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/main.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './hooks/useAuth';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
