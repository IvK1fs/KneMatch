import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { HomePage } from './pages/HomePage';
import { UpcomingPage } from './pages/UpcomingPage';
import { UpcomingShowcasePage } from './pages/UpcomingShowcasePage';
import { TopTenPage } from './pages/TopTenPage';
import { SearchPage } from './pages/SearchPage';
import { DetailsPage } from './pages/DetailsPage';

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
      { path: 'details/:id', Component: DetailsPage },
    ],
  },
]);
