/* eslint-disable react/jsx-no-undef */
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useHref, useLocation } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import NotFound from '../pages/feedback/NotFound';

const removeTrailingSlashes = (url) => url.replace(/\/+$/, '');
const MainLayout = () => {
  const location = useLocation();
  const href = removeTrailingSlashes(useHref());

  if (
    !localStorage.getItem('token')
  ) {
    return <Navigate to="/login" state={{ prevUrl: `${location.pathname}${location.search}` }} />;
  }

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Navbar />
        <Content className="bg-[#f2f2f2] p-4">
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
export default MainLayout;
