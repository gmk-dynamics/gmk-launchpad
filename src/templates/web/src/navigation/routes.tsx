import HomePage from '@pages/home';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// GMK:PAGE_IMPORTS

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* GMK:PAGE_ROUTES */}
    </Routes>
  );
};

export default AppRoutes;
