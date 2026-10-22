import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from '../features/home/HomePage';
import { SpeciesPage } from '../features/species/SpeciesPage';
import { TaxonomyPage } from '../features/taxonomy/TaxonomyPage';
import { TaxonDetailPage } from '../features/taxonomy/TaxonDetailPage';
import { ExplorePage } from '../features/explore/ExplorePage';
import { CreditsPage } from '../features/credits/CreditsPage';
import { DataQualityPage } from '../features/admin/DataQualityPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'explore',
        element: <ExplorePage />,
      },
      {
        path: 'species/:slug',
        element: <SpeciesPage />,
      },
      {
        path: 'taxa',
        element: <TaxonomyPage />,
      },
      {
        path: 'taxa/:rank/:name',
        element: <TaxonDetailPage />,
      },
      {
        path: 'credits',
        element: <CreditsPage />,
      },
      {
        path: 'dev/data-quality',
        element: <DataQualityPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
