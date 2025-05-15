import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App.tsx';
import './index.css';
import { store } from './store/index.ts';

// Tạo Redux store


createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <App />
    </Provider>
);
