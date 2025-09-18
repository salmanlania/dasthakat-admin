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
  const { user } = useSelector((state) => state.auth);
  const permissions = user?.permission;

  if (
    !localStorage.getItem('token') ||
    !localStorage.getItem('user') ||
    !localStorage.getItem('company_id') ||
    !localStorage.getItem('company_branch_id')
  ) {
    return <Navigate to="/login" state={{ prevUrl: `${location.pathname}${location.search}` }} />;
  }

  if (href === '/user' && !permissions.user.list) return <NotFound />;
  if (href === '/user/create' && !permissions.user.add) return <NotFound />;
  if (href.startsWith('/user/edit') && !permissions.user.edit) return <NotFound />;

  if (href === '/user-permission' && !permissions.user_permission.list) return <NotFound />;
  if (href === '/user-permission/create' && !permissions.user_permission.add) return <NotFound />;
  if (href.startsWith('/user-permission/edit') && !permissions.user_permission.edit)
    return <NotFound />;

  if (href === '/currency' && !permissions.currency.list) return <NotFound />;
  if (href === '/currency/create' && !permissions.currency.add) return <NotFound />;
  if (href.startsWith('/currency/edit') && !permissions.currency.edit) return <NotFound />;

  if (href === '/company' && !permissions.company.list) return <NotFound />;
  if (href === '/company/create' && !permissions.company.add) return <NotFound />;
  if (href.startsWith('/company/edit') && !permissions.company.edit) return <NotFound />;

  if (href === '/company-branch' && !permissions.company_branch.list) return <NotFound />;
  if (href === '/company-branch/create' && !permissions.company_branch.add) return <NotFound />;
  if (href.startsWith('/company-branch/edit') && !permissions.company_branch.edit)
    return <NotFound />;

  if (href === '/salesman' && !permissions.salesman.list) return <NotFound />;
  if (href === '/customer' && !permissions.customer.list) return <NotFound />;
  if (href === '/customer/create' && !permissions.customer.add) return <NotFound />;
  if (href.startsWith('/customer/edit') && !permissions.customer.edit) return <NotFound />;

  if (href === '/vendor' && !permissions.supplier.list) return <NotFound />;
  if (href === '/vendor/create' && !permissions.supplier.add) return <NotFound />;
  if (href.startsWith('/vendor/edit') && !permissions.supplier.edit) return <NotFound />;

  if (href === '/agent' && !permissions.agent.list) return <NotFound />;
  if (href === '/agent/create' && !permissions.agent.add) return <NotFound />;
  if (href.startsWith('/agent/edit') && !permissions.agent.edit) return <NotFound />;

  if (href === '/commission-agent' && !permissions.commission_agent.list) return <NotFound />;
  if (href === '/commission-agent/create' && !permissions.commission_agent.add) return <NotFound />;
  if (href.startsWith('/commission-agent/edit') && !permissions.commission_agent.edit)
    return <NotFound />;

  // if (href === '/technician' && !permissions.technician.list) return <NotFound />;
  if (href === '/technician' && !permissions.sales_team.list) return <NotFound />;
  if (href === '/sales-team' && !permissions.sales_team.list) return <NotFound />;
  if (href === '/notes' && !permissions.terms.list) return <NotFound />;
  if (href === '/flag' && !permissions.flag.list) return <NotFound />;
  if (href === '/class' && !permissions.class.list) return <NotFound />;
  if (href === '/port' && !permissions.port.list) return <NotFound />;

  if (href === '/vessel' && !permissions.vessel.list) return <NotFound />;
  if (href === '/vessel/create' && !permissions.vessel.add) return <NotFound />;
  if (href.startsWith('/vessel/edit') && !permissions.vessel.edit) return <NotFound />;

  if (href === '/event' && !permissions.event.list) return <NotFound />;
  if (href === '/event/create' && !permissions.event.add) return <NotFound />;
  if (href.startsWith('/event/edit') && !permissions.event.edit) return <NotFound />;

  // TODO:Add customer agent and vessel agent permission here

  if (href === '/category' && !permissions.category.list) return <NotFound />;
  if (href === '/sub-category' && !permissions.sub_category.list) return <NotFound />;
  if (href === '/brand' && !permissions.brand.list) return <NotFound />;
  if (href === '/warehouse' && !permissions.warehouse.list) return <NotFound />;
  if (href === '/unit' && !permissions.unit.list) return <NotFound />;

  if (href === '/product' && !permissions.product.list) return <NotFound />;
  if (href === '/product/create' && !permissions.product.add) return <NotFound />;
  if (href.startsWith('/product/edit') && !permissions.product.edit) return <NotFound />;

  if (href === '/validity' && !permissions.validity.list) return <NotFound />;
  if (href === '/payment' && !permissions.payment.list) return <NotFound />;

  if (href === '/purchase-order' && !permissions.purchase_order.list) return <NotFound />;
  if (href === '/purchase-order/create' && !permissions.purchase_order.add) return <NotFound />;
  if (href.startsWith('/purchase-order/edit') && !permissions.purchase_order.edit)
    return <NotFound />;

  if (href === '/purchase-invoice' && !permissions.purchase_invoice.list) return <NotFound />;
  if (href === '/purchase-invoice/create' && !permissions.purchase_invoice.add) return <NotFound />;
  if (href.startsWith('/purchase-invoice/edit') && !permissions.purchase_invoice.edit)
    return <NotFound />;

  if (href === '/pick-list' && !permissions.picklist.list) return <NotFound />;
  if (href === '/service-list' && !permissions.servicelist.list) return <NotFound />;
  if (href === '/goods-received-note' && !permissions.good_received_note.list) return <NotFound />;
  if (href === '/goods-received-note/create' && !permissions.good_received_note.add)
    return <NotFound />;
  if (href.startsWith('/goods-received-note/edit') && !permissions.good_received_note.edit)
    return <NotFound />;

  if (href === '/quotation' && !permissions.quotation.list) return <NotFound />;
  if (href === '/quotation/create' && !permissions.quotation.add) return <NotFound />;
  if (href.startsWith('/quotation/edit') && !permissions.quotation.edit) return <NotFound />;

  if (href === '/charge-order' && !permissions.charge_order.list) return <NotFound />;
  if (href === '/charge-order/create' && !permissions.charge_order.add) return <NotFound />;
  if (href.startsWith('/charge-order/edit') && !permissions.charge_order.edit) return <NotFound />;

  if (href === '/ijo' && !permissions.job_order.list) return <NotFound />;
  if (href === '/ijo/create' && !permissions.job_order.add) return <NotFound />;
  if (href.startsWith('/ijo/edit') && !permissions.job_order.edit) return <NotFound />;

  if (href === '/shipment' && !permissions.shipment.list) return <NotFound />;
  if (href === '/shipment/create' && !permissions.shipment.add) return <NotFound />;
  if (href.startsWith('/shipment/edit') && !permissions.shipment.edit) return <NotFound />;

  if (href === '/scheduling' && !permissions.dispatch.list) return <NotFound />;

  if (href === '/sale-invoice' && !permissions.sale_invoice.list) return <NotFound />;
  if (href.startsWith('/sale-invoice/edit') && !permissions.sale_invoice.edit) return <NotFound />;

  if (href === '/stock-return' && !permissions.stock_return.list) return <NotFound />;
  if (href.startsWith('/stock-return/edit') && !permissions.stock_return.edit) return <NotFound />;

  if (href === '/credit-note' && !permissions.sale_return.list) return <NotFound />;
  if (href.startsWith('/credit-note/edit') && !permissions.sale_return.edit) return <NotFound />;

  if (href === '/purchase-invoice' && !permissions.purchase_invoice.list) return <NotFound />;
  if (href.startsWith('/purchase-invoice/edit') && !permissions.purchase_invoice.edit)
    return <NotFound />;

  if (href === '/purchase-return' && !permissions.purchase_return.list) return <NotFound />;
  if (href.startsWith('/purchase-return/edit') && !permissions.purchase_return.edit)
    return <NotFound />;

  if (href === '/opening-stock' && !permissions.opening_stock.list) return <NotFound />;
  if (href === '/opening-stock/create' && !permissions.opening_stock.add) return <NotFound />;
  if (href.startsWith('/opening-stock/edit') && !permissions.opening_stock.edit)
    return <NotFound />;

  if (href === '/bid-response-report' && !permissions?.bid_response?.show) return <NotFound />;
  if (href === '/quotation-report' && !permissions?.quote_report?.show) return <NotFound />;

  if (href === '/vendor-platform' && !permissions.vp_quotation.list) return <NotFound />;
  if (href.startsWith('/vendor-platform/edit') && !permissions.vp_quotation.edit) return <NotFound />;

  if (href === '/general-ledger/accounts' && !permissions.accounts.list) return <NotFound />;
  if (href === '/general-ledger/accounts/create' && !permissions.accounts.add) return <NotFound />;
  if (href.startsWith('/general-ledger/accounts/edit') && !permissions.accounts.edit)
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
