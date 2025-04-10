import React from 'react';
import { createRoot } from 'react-dom/client';
import CrudPage from './pages/CrudPage';
import '@mui/material/styles';

const root = document.getElementById('app');
if (root) {
    createRoot(root).render(<CrudPage />);
}
