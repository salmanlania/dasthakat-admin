import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PageLoader from './components/LoadingSpinners/PageLoader';
import MainLayout from './layouts/MainLayout';
import ErrorPage from './pages/feedback/ErrorPage';
import NotFound from './pages/feedback/NotFound';

const Login = lazy(() => import('./pages/Login'));
const Session = lazy(() => import('./pages/Session'));
const OtpVerification = lazy(() => import('./pages/OtpVerification'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

const VendorPlatformQuotation = lazy(() => import('./pages/VendorPlatform/Quotation'));
const VendorPlatform = lazy(() => import('./pages/VendorPlatform'));
const EditVendorPlatform = lazy(() => import('./pages/VendorPlatform/EditVendorPlatform'));

const VendorPlatformChargeOrder = lazy(() => import('./pages/VendorChargeOrderPlatform/ChargeOrder'));
const VendorChargeOrderPlatform = lazy(() => import('./pages/VendorChargeOrderPlatform'));
const EditVendorChargeOrderPlatform = lazy(() => import('./pages/VendorChargeOrderPlatform/EditVendorChargeOrderPlatform'));

const User = lazy(() => import('./pages/User'));
const CreateUser = lazy(() => import('./pages/User/CreateUser'));
const EditUser = lazy(() => import('./pages/User/EditUser'));

const UserPermission = lazy(() => import('./pages/UserPermission'));
const CreateUserPermission = lazy(() => import('./pages/UserPermission/CreateUserPermission'));
const EditUserPermission = lazy(() => import('./pages/UserPermission/EditUserPermission'));

const Currency = lazy(() => import('./pages/Currency'));
const CreateCurrency = lazy(() => import('./pages/Currency/CreateCurrency'));
const EditCurrency = lazy(() => import('./pages/Currency/EditCurrency'));

const Company = lazy(() => import('./pages/Company'));
const CompanySetting = lazy(() => import('./pages/CompanySetting'));
const CreateCompany = lazy(() => import('./pages/Company/CreateCompany'));
const EditCompany = lazy(() => import('./pages/Company/EditCompany'));

const CompanyBranch = lazy(() => import('./pages/CompanyBranch'));
const CreateCompanyBranch = lazy(() => import('./pages/CompanyBranch/CreateCompanyBranch'));
const EditCompanyBranch = lazy(() => import('./pages/CompanyBranch/EditCompanyBranch'));

const Salesman = lazy(() => import('./pages/Salesman'));
const SalesTeam = lazy(() => import('./pages/SalesTeam'));

const Customer = lazy(() => import('./pages/Customer'));
const CreateCustomer = lazy(() => import('./pages/Customer/CreateCustomer'));
const EditCustomer = lazy(() => import('./pages/Customer/EditCustomer'));

const Vendor = lazy(() => import('./pages/Vendor'));
const CreateVendor = lazy(() => import('./pages/Vendor/CreateVendor'));
const EditVendor = lazy(() => import('./pages/Vendor/EditVendor'));

const Agent = lazy(() => import('./pages/Agent'));
const CreateAgent = lazy(() => import('./pages/Agent/CreateAgent'));
const EditAgent = lazy(() => import('./pages/Agent/EditAgent'));

const CommissionAgent = lazy(() => import('./pages/CommissionAgent'));
const CreateCommissionAgent = lazy(() => import('./pages/CommissionAgent/CreateCommissionAgent'));
const EditCommissionAgent = lazy(() => import('./pages/CommissionAgent/EditCommissionAgent'));

const Technician = lazy(() => import('./pages/Technician'));
const Notes = lazy(() => import('./pages/Notes'));
const Flag = lazy(() => import('./pages/Flag'));
const CostCenter = lazy(() => import('./pages/CostCenter'));
const Class = lazy(() => import('./pages/Class'));
const Port = lazy(() => import('./pages/Port'));

const Vessel = lazy(() => import('./pages/Vessel'));
const CreateVessel = lazy(() => import('./pages/Vessel/CreateVessel'));
const EditVessel = lazy(() => import('./pages/Vessel/EditVessel'));

const Event = lazy(() => import('./pages/Event'));
const CreateEvent = lazy(() => import('./pages/Event/CreateEvent'));
const EditEvent = lazy(() => import('./pages/Event/EditEvent'));

const CustomerAgent = lazy(() => import('./pages/CustomerAgent'));
const VesselAgent = lazy(() => import('./pages/VesselAgent'));

const Category = lazy(() => import('./pages/Category'));
const SubCategory = lazy(() => import('./pages/SubCategory'));
const Brand = lazy(() => import('./pages/Brand'));
const Warehouse = lazy(() => import('./pages/Warehouse'));
const Unit = lazy(() => import('./pages/Unit'));

const Product = lazy(() => import('./pages/Product'));
const CreateProduct = lazy(() => import('./pages/Product/CreateProduct'));
const EditProduct = lazy(() => import('./pages/Product/EditProduct'));

const Validity = lazy(() => import('./pages/Validity'));
const Payment = lazy(() => import('./pages/Payment'));

const PurchaseOrder = lazy(() => import('./pages/PurchaseOrder'));
const CreatePurchaseOrder = lazy(() => import('./pages/PurchaseOrder/CreatePurchaseOrder'));
const EditPurchaseOrder = lazy(() => import('./pages/PurchaseOrder/EditPurchaseOrder'));

const PurchaseInvoice = lazy(() => import('./pages/PurchaseInvoice'));
const CreatePurchaseInvoice = lazy(() => import('./pages/PurchaseInvoice/CreatePurchaseInvoice'));
const EditPurchaseInvoice = lazy(() => import('./pages/PurchaseInvoice/EditPurchaseInvoice'));

const SaleInvoice = lazy(() => import('./pages/SaleInvoice'));
const EditSaleInvoice = lazy(() => import('./pages/SaleInvoice/EditSaleInvoice'));

const StockReturn = lazy(() => import('./pages/StockReturn'));
const EditStockReturn = lazy(() => import('./pages/StockReturn/EditStockReturn'));

const SaleReturn = lazy(() => import('./pages/SaleReturn'));
const EditSaleReturn = lazy(() => import('./pages/SaleReturn/EditSaleReturn'));

const CreditNote = lazy(() => import('./pages/CreditNote'));
const CreateCreditNote = lazy(() => import('./pages/CreditNote/CreateCreditNote'));
const EditCreditNote = lazy(() => import('./pages/CreditNote/EditCreditNote'));

const PurchaseReturn = lazy(() => import('./pages/PurchaseReturn'));
const EditPurchaseReturn = lazy(() => import('./pages/PurchaseReturn/EditPurchaseReturn'));

const GoodsReceivedNote = lazy(() => import('./pages/GoodsReceivedNote'));
const CreateGoodsReceivedNote = lazy(
  () => import('./pages/GoodsReceivedNote/CreateGoodsReceivedNote'),
);
const EditGoodsReceivedNote = lazy(() => import('./pages/GoodsReceivedNote/EditGoodsReceivedNote'));

const OpeningStock = lazy(() => import('./pages/OpeningStock'));
const CreateOpeningStock = lazy(() => import('./pages/OpeningStock/CreateOpeningStock'));
const EditOpeningStock = lazy(() => import('./pages/OpeningStock/EditOpeningStock'));

const Quotation = lazy(() => import('./pages/Quotation'));
const CreateQuotation = lazy(() => import('./pages/Quotation/CreateQuotation'));
const EditQuotation = lazy(() => import('./pages/Quotation/EditQuotation'));

const ChargeOrder = lazy(() => import('./pages/ChargeOrder'));
const CreateChargeOrder = lazy(() => import('./pages/ChargeOrder/CreateChargeOrder'));
const EditChargeOrder = lazy(() => import('./pages/ChargeOrder/EditChargeOrder'));

const IJO = lazy(() => import('./pages/IJO'));
const CreateIJO = lazy(() => import('./pages/IJO/CreateIJO'));
const EditIJO = lazy(() => import('./pages/IJO/EditIJO'));

const PickList = lazy(() => import('./pages/PickList'));
const EditPickList = lazy(() => import('./pages/PickList/EditPickList'));
const ServiceList = lazy(() => import('./pages/ServiceList'));

const Audit = lazy(() => import('./pages/Audit'));

const Shipment = lazy(() => import('./pages/Shipment'));
const CreateShipment = lazy(() => import('./pages/Shipment/CreateShipment'));
const EditShipment = lazy(() => import('./pages/Shipment/EditShipment'));

const ServiceOrder = lazy(() => import('./pages/ServiceOrder'));

const Scheduling = lazy(() => import('./pages/Scheduling'));

// Reports
const QuotationReport = lazy(() => import('./pages/QuotationReport'));
const BidResponseReport = lazy(() => import('./pages/BidResponseReport'));
const LedgerReport = lazy(() => import('./pages/LedgerReport'));

//ledger

const Accounts = lazy(() => import('./pages/GeneralLedger/Accounts'));
const CreateAccounts = lazy(() => import('./pages/GeneralLedger/Accounts/CreateAccounts'));
const EditAccounts = lazy(() => import('./pages/GeneralLedger/Accounts/EditAccounts'));

const ModuleSetting = lazy(() => import('./pages/GeneralLedger/ModulesSetting'));

const CustomerPayment = lazy(() => import('./pages/CustomerPayment'));
const CreateCustomerPayment = lazy(() => import('./pages/CustomerPayment/CreateCustomerPayment'));
const EditCustomerPayment = lazy(() => import('./pages/CustomerPayment/EditCustomerPayment'));

const VendorPayment = lazy(() => import('./pages/VendorPayment'));
const CreateVendorPayment = lazy(() => import('./pages/VendorPayment/CreateVendorPayment'));
const EditVendorPayment = lazy(() => import('./pages/VendorPayment/EditVendorPayment'));

const VoucherPayment = lazy(() => import('./pages/PaymentVoucher'));
const CreateVoucherPayment = lazy(() => import('./pages/PaymentVoucher/CreatePaymentVoucher'));
const EditVoucherPayment = lazy(() => import('./pages/PaymentVoucher/EditPaymentVoucher'));

const CustomerPaymentSettlement = lazy(() => import('./pages/CustomerPaymentSettlement'));
const CreateCustomerPaymentSettlement = lazy(() => import('./pages/CustomerPaymentSettlement/CreateCustomerPaymentSettlement'));
const EditCustomerPaymentSettlement = lazy(() => import('./pages/CustomerPaymentSettlement/EditCustomerPaymentSettlement'));

const VendorBill = lazy(() => import('./pages/VendorBill'));
const CreateVendorBill = lazy(() => import('./pages/VendorBill/CreateVendorBill'));
const EditVendorBill = lazy(() => import('./pages/VendorBill/EditVendorBill'));

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
            path: '/user-permission',
            element: (
              <Suspense fallback={<PageLoader />}>
                <UserPermission />
              </Suspense>
            ),
          },
          {
            path: '/user-permission/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateUserPermission />
              </Suspense>
            ),
          },
          {
            path: '/user-permission/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditUserPermission />
              </Suspense>
            ),
          },
          {
            path: '/currency',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Currency />
              </Suspense>
            ),
          },
          {
            path: '/currency/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateCurrency />
              </Suspense>
            ),
          },
          {
            path: '/currency/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditCurrency />
              </Suspense>
            ),
          },
          {
            path: '/company',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Company />
              </Suspense>
            ),
          },
          {
            path: '/company-setting',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CompanySetting />
              </Suspense>
            ),
          },
          {
            path: '/company/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateCompany />
              </Suspense>
            ),
          },
          {
            path: '/company/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditCompany />
              </Suspense>
            ),
          },
          {
            path: '/company-branch',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CompanyBranch />
              </Suspense>
            ),
          },
          {
            path: '/company-branch/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateCompanyBranch />
              </Suspense>
            ),
          },
          {
            path: '/company-branch/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditCompanyBranch />
              </Suspense>
            ),
          },
          {
            path: '/salesman',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Salesman />
              </Suspense>
            ),
          },
          {
            path: '/sales-team',
            element: (
              <Suspense fallback={<PageLoader />}>
                <SalesTeam />
              </Suspense>
            ),
          },
          {
            path: '/customer',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Customer />
              </Suspense>
            ),
          },
          {
            path: '/customer/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateCustomer />
              </Suspense>
            ),
          },
          {
            path: '/customer/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditCustomer />
              </Suspense>
            ),
          },
          {
            path: '/vendor',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Vendor />
              </Suspense>
            ),
          },
          {
            path: '/vendor/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateVendor />
              </Suspense>
            ),
          },
          {
            path: '/vendor/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditVendor />
              </Suspense>
            ),
          },
          {
            path: '/agent',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Agent />
              </Suspense>
            ),
          },
          {
            path: '/agent/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateAgent />
              </Suspense>
            ),
          },
          {
            path: '/agent/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditAgent />
              </Suspense>
            ),
          },
          {
            path: '/commission-agent',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CommissionAgent />
              </Suspense>
            ),
          },
          {
            path: '/commission-agent/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateCommissionAgent />
              </Suspense>
            ),
          },
          {
            path: '/commission-agent/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditCommissionAgent />
              </Suspense>
            ),
          },
          {
            path: '/notes',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Notes />
              </Suspense>
            ),
          },
          {
            path: '/technician',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Technician />
              </Suspense>
            ),
          },
          {
            path: '/flag',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Flag />
              </Suspense>
            ),
          },
          {
            path: '/cost-center',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CostCenter />
              </Suspense>
            ),
          },
          {
            path: '/class',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Class />
              </Suspense>
            ),
          },
          {
            path: '/port',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Port />
              </Suspense>
            ),
          },
          {
            path: '/vessel',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Vessel />
              </Suspense>
            ),
          },
          {
            path: '/vessel/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateVessel />
              </Suspense>
            ),
          },
          {
            path: '/vessel/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditVessel />
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
            path: '/category',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Category />
              </Suspense>
            ),
          },
          {
            path: '/sub-category',
            element: (
              <Suspense fallback={<PageLoader />}>
                <SubCategory />
              </Suspense>
            ),
          },
          {
            path: '/brand',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Brand />
              </Suspense>
            ),
          },
          {
            path: '/warehouse',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Warehouse />
              </Suspense>
            ),
          },
          {
            path: '/unit',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Unit />
              </Suspense>
            ),
          },
          {
            path: '/event',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Event />
              </Suspense>
            ),
          },
          {
            path: '/event/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateEvent />
              </Suspense>
            ),
          },
          {
            path: '/event/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditEvent />
              </Suspense>
            ),
          },
          {
            path: '/customer-agent',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CustomerAgent />
              </Suspense>
            ),
          },
          {
            path: '/vessel-agent',
            element: (
              <Suspense fallback={<PageLoader />}>
                <VesselAgent />
              </Suspense>
            ),
          },
          {
            path: '/validity',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Validity />
              </Suspense>
            ),
          },
          {
            path: '/payment',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Payment />
              </Suspense>
            ),
          },
          {
            path: '/purchase-order',
            element: (
              <Suspense fallback={<PageLoader />}>
                <PurchaseOrder />
              </Suspense>
            ),
          },
          {
            path: '/purchase-order/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreatePurchaseOrder />
              </Suspense>
            ),
          },
          {
            path: '/purchase-order/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditPurchaseOrder />
              </Suspense>
            ),
          },
          {
            path: '/purchase-invoice',
            element: (
              <Suspense fallback={<PageLoader />}>
                <PurchaseInvoice />
              </Suspense>
            ),
          },
          {
            path: '/purchase-invoice/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreatePurchaseInvoice />
              </Suspense>
            ),
          },
          {
            path: '/purchase-invoice/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditPurchaseInvoice />
              </Suspense>
            ),
          },
          {
            path: '/sale-invoice',
            element: (
              <Suspense fallback={<PageLoader />}>
                <SaleInvoice />
              </Suspense>
            ),
          },
          {
            path: '/sale-invoice/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditSaleInvoice />
              </Suspense>
            ),
          },
          {
            path: '/stock-return',
            element: (
              <Suspense fallback={<PageLoader />}>
                <StockReturn />
              </Suspense>
            ),
          },
          {
            path: '/stock-return/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditStockReturn />
              </Suspense>
            ),
          },
          {
            path: '/sale-return',
            element: (
              <Suspense fallback={<PageLoader />}>
                <SaleReturn />
              </Suspense>
            ),
          },
          {
            path: '/sale-return/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditSaleReturn />
              </Suspense>
            ),
          },
          {
            path: 'credit-note',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreditNote />
              </Suspense>
            ),
          },
          {
            path: 'credit-note/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateCreditNote />
              </Suspense>
            ),
          },
          {
            path: 'credit-note/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditCreditNote />
              </Suspense>
            ),
          },
          {
            path: '/purchase-return',
            element: (
              <Suspense fallback={<PageLoader />}>
                <PurchaseReturn />
              </Suspense>
            ),
          },
          {
            path: '/purchase-return/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditPurchaseReturn />
              </Suspense>
            ),
          },
          {
            path: '/goods-received-note',
            element: (
              <Suspense fallback={<PageLoader />}>
                <GoodsReceivedNote />
              </Suspense>
            ),
          },
          {
            path: '/goods-received-note/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateGoodsReceivedNote />
              </Suspense>
            ),
          },
          {
            path: '/goods-received-note/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditGoodsReceivedNote />
              </Suspense>
            ),
          },
          {
            path: '/opening-stock',
            element: (
              <Suspense fallback={<PageLoader />}>
                <OpeningStock />
              </Suspense>
            ),
          },
          {
            path: '/opening-stock/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateOpeningStock />
              </Suspense>
            ),
          },
          {
            path: '/opening-stock/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditOpeningStock />
              </Suspense>
            ),
          },
          {
            path: '/quotation',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Quotation />
              </Suspense>
            ),
          },
          {
            path: '/quotation/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateQuotation />
              </Suspense>
            ),
          },
          {
            path: '/quotation/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditQuotation />
              </Suspense>
            ),
          },
          {
            path: '/vendor-platform-quote',
            element: (
              <Suspense fallback={<PageLoader />}>
                <VendorPlatform />
              </Suspense>
            ),
          },
          {
            path: '/vendor-platform-quote/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditVendorPlatform />
              </Suspense>
            ),
          },
          {
            path: '/vendor-platform-charge',
            element: (
              <Suspense fallback={<PageLoader />}>
                <VendorChargeOrderPlatform />
              </Suspense>
            ),
          },
          {
            path: '/vendor-platform-charge/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditVendorChargeOrderPlatform />
              </Suspense>
            ),
          },
          {
            path: '/charge-order',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ChargeOrder />
              </Suspense>
            ),
          },
          {
            path: '/charge-order/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateChargeOrder />
              </Suspense>
            ),
          },
          {
            path: '/charge-order/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditChargeOrder />
              </Suspense>
            ),
          },
          {
            path: '/ijo',
            element: (
              <Suspense fallback={<PageLoader />}>
                <IJO />
              </Suspense>
            ),
          },
          {
            path: '/ijo/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateIJO />
              </Suspense>
            ),
          },
          {
            path: '/ijo/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditIJO />
              </Suspense>
            ),
          },
          {
            path: '/pick-list',
            element: (
              <Suspense fallback={<PageLoader />}>
                <PickList />
              </Suspense>
            ),
          },
          {
            path: '/pick-list/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditPickList />
              </Suspense>
            ),
          },
          {
            path: '/service-list',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ServiceList />
              </Suspense>
            ),
          },
          {
            path: '/shipment',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Shipment />
              </Suspense>
            ),
          },
          {
            path: '/shipment/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateShipment />
              </Suspense>
            ),
          },
          {
            path: '/shipment/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditShipment />
              </Suspense>
            ),
          },
          {
            path: '/service-order',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ServiceOrder />
              </Suspense>
            ),
          },
          {
            path: '/scheduling',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Scheduling />
              </Suspense>
            ),
          },
          // Reports
          {
            path: '/quotation-report',
            element: (
              <Suspense fallback={<PageLoader />}>
                <QuotationReport />
              </Suspense>
            ),
          },
          {
            path: '/bid-response-report',
            element: (
              <Suspense fallback={<PageLoader />}>
                <BidResponseReport />
              </Suspense>
            ),
          },
          {
            path: '/ledger-report',
            element: (
              <Suspense fallback={<PageLoader />}>
                <LedgerReport />
              </Suspense>
            ),
          },
          {
            path: '/audit',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Audit />
              </Suspense>
            ),
          },
          {
            path: '/stock-return',
            element: (
              <Suspense fallback={<PageLoader />}>
                <StockReturn />
              </Suspense>
            ),
          },
          {
            path: '/general-ledger',
            children: [
              {
                path: 'gl-setup',
                children: [
                  {
                    path: 'accounts',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <Accounts />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'accounts/create',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <CreateAccounts />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'accounts/edit/:id',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <EditAccounts />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'gl-module-setting',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <ModuleSetting />
                      </Suspense>
                    ),
                  },
                ]
              },
              {
                path: 'transactions',
                children: [
                  {
                    path: 'customer-payment',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <CustomerPayment />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'customer-payment/create',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <CreateCustomerPayment />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'customer-payment/edit/:id',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <EditCustomerPayment />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'vendor-payment',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <VendorPayment />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'vendor-payment/create',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <CreateVendorPayment />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'vendor-payment/edit/:id',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <EditVendorPayment />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'payment-voucher',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <VoucherPayment />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'payment-voucher/create',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <CreateVoucherPayment />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'payment-voucher/edit/:id',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <EditVoucherPayment />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'customer-payment-settlement',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <CustomerPaymentSettlement />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'customer-payment-settlement/create',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <CreateCustomerPaymentSettlement />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'customer-payment-settlement/edit/:id',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <EditCustomerPaymentSettlement />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'vendor-bill',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <VendorBill />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'vendor-bill/create',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <CreateVendorBill />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'vendor-bill/edit/:id',
                    element: (
                      <Suspense fallback={<PageLoader />}>
                        <EditVendorBill />
                      </Suspense>
                    ),
                  },
                ]
              },
            ]
          },
        ],
      },
      {
        path: '/vendor-platform',
        children: [
          {
            path: 'quotation/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <VendorPlatformQuotation />
              </Suspense>
            ),
          },
          {
            path: 'charge-order/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <VendorPlatformChargeOrder />
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
        path: '/session',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Session />
          </Suspense>
        ),
      },
      {
        path: '/otp-verification',
        element: (
          <Suspense fallback={<PageLoader />}>
            <OtpVerification />
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