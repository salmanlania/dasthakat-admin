import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PageLoader from './components/LoadingSpinners/PageLoader';
import MainLayout from './layouts/MainLayout';
import ErrorPage from './pages/feedback/ErrorPage';
import NotFound from './pages/feedback/NotFound';

const Login = lazy(() => import('./pages/Login'));
const Session = lazy(() => import('./pages/Session'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

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

const Customer = lazy(() => import('./pages/Customer'));
const CreateCustomer = lazy(() => import('./pages/Customer/CreateCustomer'));
const EditCustomer = lazy(() => import('./pages/Customer/EditCustomer'));

const Vendor = lazy(() => import('./pages/Vendor'));
const CreateVendor = lazy(() => import('./pages/Vendor/CreateVendor'));
const EditVendor = lazy(() => import('./pages/Vendor/EditVendor'));

const Agent = lazy(() => import('./pages/Agent'));
const CreateAgent = lazy(() => import('./pages/Agent/CreateAgent'));
const EditAgent = lazy(() => import('./pages/Agent/EditAgent'));

const Technician = lazy(() => import('./pages/Technician'));
const Notes = lazy(() => import('./pages/Notes'));
const Flag = lazy(() => import('./pages/Flag'));
const Class = lazy(() => import('./pages/Class'));
const Port = lazy(() => import('./pages/Port'));

const Vessel = lazy(() => import('./pages/Vessel'));
const CreateVessel = lazy(() => import('./pages/Vessel/CreateVessel'));
const EditVessel = lazy(() => import('./pages/Vessel/EditVessel'));

const Event = lazy(() => import('./pages/Event'));
const CreateEvent = lazy(() => import('./pages/Event/CreateEvent'));
const EditEvent = lazy(() => import('./pages/Event/EditEvent'));

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

const GoodsReceivedNote = lazy(() => import('./pages/GoodsReceivedNote'));
const CreateGoodsReceivedNote = lazy(
  () => import('./pages/GoodsReceivedNote/CreateGoodsReceivedNote')
);
const EditGoodsReceivedNote = lazy(() => import('./pages/GoodsReceivedNote/EditGoodsReceivedNote'));

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
const ServiceList = lazy(() => import('./pages/ServiceList'));

const Audit = lazy(() => import('./pages/Audit'));

const Shipment = lazy(() => import('./pages/Shipment'));
const CreateShipment = lazy(() => import('./pages/Shipment/CreateShipment'));
const EditShipment = lazy(() => import('./pages/Shipment/EditShipment'));

const ServiceOrder = lazy(() => import('./pages/ServiceOrder'));

const Scheduling = lazy(() => import('./pages/Scheduling/'));

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
            )
          },
          {
            path: '/user',
            element: (
              <Suspense fallback={<PageLoader />}>
                <User />
              </Suspense>
            )
          },
          {
            path: '/user/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateUser />
              </Suspense>
            )
          },
          {
            path: '/user/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditUser />
              </Suspense>
            )
          },
          {
            path: '/user-permission',
            element: (
              <Suspense fallback={<PageLoader />}>
                <UserPermission />
              </Suspense>
            )
          },
          {
            path: '/user-permission/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateUserPermission />
              </Suspense>
            )
          },
          {
            path: '/user-permission/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditUserPermission />
              </Suspense>
            )
          },
          {
            path: '/currency',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Currency />
              </Suspense>
            )
          },
          {
            path: '/currency/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateCurrency />
              </Suspense>
            )
          },
          {
            path: '/currency/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditCurrency />
              </Suspense>
            )
          },
          {
            path: '/company',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Company />
              </Suspense>
            )
          },
          {
            path: '/company-setting',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CompanySetting />
              </Suspense>
            )
          },
          {
            path: '/company/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateCompany />
              </Suspense>
            )
          },
          {
            path: '/company/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditCompany />
              </Suspense>
            )
          },
          {
            path: '/company-branch',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CompanyBranch />
              </Suspense>
            )
          },
          {
            path: '/company-branch/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateCompanyBranch />
              </Suspense>
            )
          },
          {
            path: '/company-branch/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditCompanyBranch />
              </Suspense>
            )
          },
          {
            path: '/salesman',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Salesman />
              </Suspense>
            )
          },
          {
            path: '/customer',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Customer />
              </Suspense>
            )
          },
          {
            path: '/customer/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateCustomer />
              </Suspense>
            )
          },
          {
            path: '/customer/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditCustomer />
              </Suspense>
            )
          },
          {
            path: '/vendor',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Vendor />
              </Suspense>
            )
          },
          {
            path: '/vendor/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateVendor />
              </Suspense>
            )
          },
          {
            path: '/vendor/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditVendor />
              </Suspense>
            )
          },
          {
            path: '/agent',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Agent />
              </Suspense>
            )
          },
          {
            path: '/agent/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateAgent />
              </Suspense>
            )
          },
          {
            path: '/agent/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditAgent />
              </Suspense>
            )
          },
          {
            path: '/notes',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Notes />
              </Suspense>
            )
          },
          {
            path: '/technician',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Technician />
              </Suspense>
            )
          },
          {
            path: '/flag',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Flag />
              </Suspense>
            )
          },
          {
            path: '/class',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Class />
              </Suspense>
            )
          },
          {
            path: '/port',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Port />
              </Suspense>
            )
          },
          {
            path: '/vessel',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Vessel />
              </Suspense>
            )
          },
          {
            path: '/vessel/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateVessel />
              </Suspense>
            )
          },
          {
            path: '/vessel/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditVessel />
              </Suspense>
            )
          },
          {
            path: '/product',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Product />
              </Suspense>
            )
          },
          {
            path: '/product/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateProduct />
              </Suspense>
            )
          },
          {
            path: '/product/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditProduct />
              </Suspense>
            )
          },

          {
            path: '/category',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Category />
              </Suspense>
            )
          },
          {
            path: '/sub-category',
            element: (
              <Suspense fallback={<PageLoader />}>
                <SubCategory />
              </Suspense>
            )
          },
          {
            path: '/brand',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Brand />
              </Suspense>
            )
          },
          {
            path: '/warehouse',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Warehouse />
              </Suspense>
            )
          },
          {
            path: '/unit',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Unit />
              </Suspense>
            )
          },
          {
            path: '/event',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Event />
              </Suspense>
            )
          },
          {
            path: '/event/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateEvent />
              </Suspense>
            )
          },
          {
            path: '/event/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditEvent />
              </Suspense>
            )
          },
          {
            path: '/validity',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Validity />
              </Suspense>
            )
          },
          {
            path: '/payment',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Payment />
              </Suspense>
            )
          },
          {
            path: '/purchase-order',
            element: (
              <Suspense fallback={<PageLoader />}>
                <PurchaseOrder />
              </Suspense>
            )
          },
          {
            path: '/purchase-order/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreatePurchaseOrder />
              </Suspense>
            )
          },
          {
            path: '/purchase-order/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditPurchaseOrder />
              </Suspense>
            )
          },
          {
            path: '/purchase-invoice',
            element: (
              <Suspense fallback={<PageLoader />}>
                <PurchaseInvoice />
              </Suspense>
            )
          },
          {
            path: '/purchase-invoice/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreatePurchaseInvoice />
              </Suspense>
            )
          },
          {
            path: '/purchase-invoice/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditPurchaseInvoice />
              </Suspense>
            )
          },
          {
            path: '/goods-received-note',
            element: (
              <Suspense fallback={<PageLoader />}>
                <GoodsReceivedNote />
              </Suspense>
            )
          },
          {
            path: '/goods-received-note/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateGoodsReceivedNote />
              </Suspense>
            )
          },
          {
            path: '/goods-received-note/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditGoodsReceivedNote />
              </Suspense>
            )
          },
          {
            path: '/quotation',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Quotation />
              </Suspense>
            )
          },
          {
            path: '/quotation/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateQuotation />
              </Suspense>
            )
          },
          {
            path: '/quotation/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditQuotation />
              </Suspense>
            )
          },
          {
            path: '/charge-order',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ChargeOrder />
              </Suspense>
            )
          },
          {
            path: '/charge-order/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateChargeOrder />
              </Suspense>
            )
          },
          {
            path: '/charge-order/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditChargeOrder />
              </Suspense>
            )
          },
          {
            path: '/ijo',
            element: (
              <Suspense fallback={<PageLoader />}>
                <IJO />
              </Suspense>
            )
          },
          {
            path: '/ijo/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateIJO />
              </Suspense>
            )
          },
          {
            path: '/ijo/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditIJO />
              </Suspense>
            )
          },
          {
            path: '/pick-list',
            element: (
              <Suspense fallback={<PageLoader />}>
                <PickList />
              </Suspense>
            )
          },
          {
            path: '/service-list',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ServiceList />
              </Suspense>
            )
          },
          {
            path: '/shipment',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Shipment />
              </Suspense>
            )
          },
          {
            path: '/shipment/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateShipment />
              </Suspense>
            )
          },
          {
            path: '/shipment/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditShipment />
              </Suspense>
            )
          },
          {
            path: '/service-order',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ServiceOrder />
              </Suspense>
            )
          },
          {
            path: '/scheduling',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Scheduling />
              </Suspense>
            )
          },
          {
            path: '/audit',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Audit />
              </Suspense>
            )
          }
        ]
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        )
      },
      {
        path: '/session',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Session />
          </Suspense>
        )
      },
      {
        path: '*',
        element: <NotFound />
      }
    ],
    {
      basename: `${import.meta.env.VITE_BASE_URL}`,
    },
  );

  return <RouterProvider router={router} />;
}

export default Routes;
