import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Navigate, Outlet, useHref, useLocation } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import { useSelector } from "react-redux";

const removeTrailingSlashes = (url) => url.replace(/\/+$/, "");
const MainLayout = () => {
  const location = useLocation();
  const href = removeTrailingSlashes(useHref());
  const { user } = useSelector((state) => state.auth);
  const permissions = user?.permission;

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

  if (href === "/company" && !permissions.company.list) return <NotFound />;
  if (href === "/company/create" && !permissions.company.add)
    return <NotFound />;
  if (href.startsWith("/company/edit") && !permissions.company.edit)
    return <NotFound />;

  if (href === "/company-branch" && !permissions.company_branch.list)
    return <NotFound />;
  if (href === "/company-branch/create" && !permissions.company_branch.add)
    return <NotFound />;
  if (
    href.startsWith("/company-branch/edit") &&
    !permissions.company_branch.edit
  )
    return <NotFound />;

  if (href === "/customer" && !permissions.customer.list) return <NotFound />;
  if (href === "/customer/create" && !permissions.customer.add)
    return <NotFound />;
  if (href.startsWith("/customer/edit") && !permissions.customer.edit)
    return <NotFound />;

  if (href === "/vendor" && !permissions.supplier.list) return <NotFound />;
  if (href === "/vendor/create" && !permissions.supplier.add)
    return <NotFound />;
  if (href.startsWith("/vendor/edit") && !permissions.supplier.edit)
    return <NotFound />;

  if (href === "/user" && !permissions.user.list) return <NotFound />;
  if (href === "/user/create" && !permissions.user.add) return <NotFound />;
  if (href.startsWith("/user/edit") && !permissions.user.edit)
    return <NotFound />;

  if (href === "/user-permission" && !permissions.user_permission.list)
    return <NotFound />;
  if (href === "/user-permission/create" && !permissions.user_permission.add)
    return <NotFound />;
  if (
    href.startsWith("/user-permission/edit") &&
    !permissions.user_permission.edit
  )
    return <NotFound />;

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
