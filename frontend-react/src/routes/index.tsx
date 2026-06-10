import { createBrowserRouter, RouterProvider } from 'react-router';
import UserLayout from '../layouts/UserLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { lazy, Suspense, type JSX } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingFallback from '../components/LoadingFallback';
import AdminAuthLayout from '../layouts/AdminAuthLayout';

// Landing
const LandingPage = lazy(() => import('../pages/Landing/LandingPage'));
const CategoryPage = lazy(() => import('../pages/Landing/CategoryPage'));
const DetailCategoryPage = lazy(() => import('../pages/Landing/DetailCategoryPage'));
const ProductPage = lazy(() => import('../pages/Landing/ProductPage'));
const DetailProductPage = lazy(() => import('../pages/Landing/DetailProductPage'));
const CartPage = lazy(() => import('../pages/Landing/CartPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));

// Admin
const LoginAdminPage = lazy(() => import('../pages/Admin/LoginAdminPage'));

// Dashboard
const MainDashPage = lazy(() => import('../pages/Dashboard/MainDashPage'));
const ProductDashPage = lazy(() => import('../pages/Dashboard/ProductDashPage'));
const OrderDashPage = lazy(() => import('../pages/Dashboard/OrderDashPage'));

const withSuspense = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: withSuspense(LandingPage),
      },
      {
        path: 'category',
        element: withSuspense(CategoryPage),
      },
      {
        path: 'category/:slug',
        element: withSuspense(DetailCategoryPage),
      },
      {
        path: 'product',
        element: <ProductPage />,
      },
      {
        path: 'product/:slug',
        element: withSuspense(DetailProductPage),
      },
      {
        path: 'cart',
        element: withSuspense(CartPage),
      },
      {
        path: 'login',
        element: withSuspense(LoginPage),
      },
      {
        path: 'register',
        element: withSuspense(RegisterPage),
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminAuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'login',
        element: <LoginAdminPage />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: withSuspense(MainDashPage),
      },
      {
        path: 'product',
        element: withSuspense(ProductDashPage),
      },
      {
        path: 'product/:productId',
        // element:
      },
      {
        path: 'product/:productId/edit',
        // element:
      },
      {
        path: 'order',
        element: withSuspense(OrderDashPage),
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
