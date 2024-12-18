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

  // Show not found page if user has no permission to access the page
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

  if (href === "/currency" && !permissions.currency.list) return <NotFound />;
  if (href === "/currency/create" && !permissions.currency.add)
    return <NotFound />;
  if (href.startsWith("/currency/edit") && !permissions.currency.edit)
    return <NotFound />;

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

  if (href === "/salesman" && !permissions.salesman.list) return <NotFound />;
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

  if (href === "/terms" && !permissions.terms.list) return <NotFound />;
  if (href === "/flag" && !permissions.flag.list) return <NotFound />;
  if (href === "/class" && !permissions.class.list) return <NotFound />;

  if (href === "/vessel" && !permissions.vessel.list) return <NotFound />;
  if (href === "/vessel/create" && !permissions.vessel.add) return <NotFound />;
  if (href.startsWith("/vessel/edit") && !permissions.vessel.edit)
    return <NotFound />;

  if (href === "/event" && !permissions.event.list) return <NotFound />;
  if (href === "/event/create" && !permissions.event.add) return <NotFound />;
  if (href.startsWith("/event/edit") && !permissions.event.edit)
    return <NotFound />;

  if (href === "/category" && !permissions.category.list) return <NotFound />;
  if (href === "/sub-category" && !permissions.sub_category.list)
    return <NotFound />;
  if (href === "/brand" && !permissions.brand.list) return <NotFound />;
  if (href === "/unit" && !permissions.unit.list) return <NotFound />;

  if (href === "/product" && !permissions.product.list) return <NotFound />;
  if (href === "/product/create" && !permissions.product.add)
    return <NotFound />;
  if (href.startsWith("/product/edit") && !permissions.product.edit)
    return <NotFound />;

  if (href === "/validity" && !permissions.validity.list) return <NotFound />;
  if (href === "/payment" && !permissions.payment.list) return <NotFound />;

  if (href === "/quotation" && !permissions.quotation.list) return <NotFound />;
  if (href === "/quotation/create" && !permissions.quotation.add)
    return <NotFound />;
  if (href.startsWith("/quotation/edit") && !permissions.quotation.edit)
    return <NotFound />;

  if (href === "/charge-order" && !permissions.charge_order.list)
    return <NotFound />;
  if (href === "/charge-order/create" && !permissions.charge_order.add)
    return <NotFound />;
  if (href.startsWith("/charge-order/edit") && !permissions.charge_order.edit)
    return <NotFound />;

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
