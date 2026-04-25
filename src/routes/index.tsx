// src/routes/index.tsx
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { Dashboard } from '../features/dashboard/Dashboard';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});