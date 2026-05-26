import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Home } from '../pages/Home';
import { FAQPage } from '../pages/FAQPage';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { AddFAQ } from '../pages/AddFAQ';
import { FAQDetails } from '../pages/FAQDetails';
import { Profile } from '../pages/Profile';
import { NotFound } from '../pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'faqs',
        element: <FAQPage />,
      },
      {
        path: 'faqs/:id',
        element: <FAQDetails />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'add-faq',
        element: (
          <ProtectedRoute>
            <AddFAQ />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
