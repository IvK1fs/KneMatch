import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { HomePage } from './pages/HomePage';
import UpcomingPage from './pages/UpcomingPage';
import { UpcomingShowcasePage } from './pages/UpcomingShowcasePage';
import { TopTenPage } from './pages/TopTenPage';
import { SearchPage } from './pages/SearchPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'upcoming', Component: UpcomingPage },
      { path: 'upcoming-showcase', Component: UpcomingShowcasePage },
      { path: 'top-10', Component: TopTenPage },
      { path: 'search', Component: SearchPage },
      { path: 'login', Component: LoginPage },
      { path: 'profile', Component: ProfilePage },
    ],
  },
]);