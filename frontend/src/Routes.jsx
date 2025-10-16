import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PageLoader from './components/LoadingSpinners/PageLoader';
import MainLayout from './layouts/MainLayout';
import ErrorPage from './pages/feedback/ErrorPage';
import NotFound from './pages/feedback/NotFound';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

const User = lazy(() => import('./pages/User'));
const CreateUser = lazy(() => import('./pages/User/CreateUser'));
const EditUser = lazy(() => import('./pages/User/EditUser'));

const Product = lazy(() => import('./pages/Product'));
const CreateProduct = lazy(() => import('./pages/Product/CreateProduct'));
const EditProduct = lazy(() => import('./pages/Product/EditProduct'));

const Order = lazy(() => import('./pages/Orders'));
const CreateOrder = lazy(() => import('./pages/Orders/CreateOrder'));
const EditOrder = lazy(() => import('./pages/Orders/EditOrder'));

const Category = lazy(() => import('./pages/Category'));
const Brand = lazy(() => import('./pages/Brand'));

function Routes() {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: '/user',
            element: (
              <Suspense fallback={<PageLoader />}>
                <User />
              </Suspense>
            ),
          },
          {
            path: '/user/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateUser />
              </Suspense>
            ),
          },
          {
            path: '/user/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditUser />
              </Suspense>
            ),
          },
          {
            path: '/product',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Product />
              </Suspense>
            ),
          },
          {
            path: '/product/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateProduct />
              </Suspense>
            ),
          },
          {
            path: '/product/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditProduct />
              </Suspense>
            ),
          },
          {
            path: 'orders',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Order />
              </Suspense>
            ),
          },
          {
            path: 'orders/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateOrder />
              </Suspense>
            ),
          },
          {
            path: 'orders/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditOrder />
              </Suspense>
            ),
          },
          {
            path: 'category',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Category />
              </Suspense>
            ),
          },
          {
            path: 'brand',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Brand />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
    {
      basename: `${import.meta.env.VITE_BASE_URL}`,
    },
  );

  return <RouterProvider router={router} />;
}

export default Routes;