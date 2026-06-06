import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants';
import { HomePage } from './pages/HomePage';
import { GroupPage } from './pages/GroupPage';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.GROUP} element={<GroupPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);