import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import '../lib/i18n';

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};
