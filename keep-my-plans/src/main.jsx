import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants';
import { HomePage } from './pages/HomePage';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.GROUP} element={<div>Group page</div>} />
        <Route path={ROUTES.JOIN} element={<div>Join page</div>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);