import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";

const MainLayout = () => {
  const location = useLocation();

  if (
    !localStorage.getItem("token") ||
    !localStorage.getItem("user") ||
    !localStorage.getItem("company_id") ||
    !localStorage.getItem("company_branch_id")
  ) {
    return (
      <Navigate
        to="/login"
        state={{ prevUrl: `${location.pathname}${location.search}` }}
      />
    );
  }

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout
        className={`${window.innerWidth <= 1000 ? "!w-screen" : "w-full"}`}
      >
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
