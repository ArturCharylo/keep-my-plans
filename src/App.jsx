import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants';
import { HomePage } from './pages/HomePage';
import { GroupPage } from './pages/GroupPage';
import { useTheme } from './hooks/useTheme';
import { Navigation } from './components/layout/Navigation';

export const App = () => {
  useTheme();
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.GROUP} element={<GroupPage />} />
      </Routes>
    </BrowserRouter>
  );
};
