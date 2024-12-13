import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PageLoader from "./components/LoadingSpinners/PageLoader";
import MainLayout from "./layouts/MainLayout";
import ErrorPage from "./pages/feedback/ErrorPage";
import NotFound from "./pages/feedback/NotFound";

const Login = lazy(() => import("./pages/Login"));
const Session = lazy(() => import("./pages/Session"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const User = lazy(() => import("./pages/User"));
const CreateUser = lazy(() => import("./pages/User/CreateUser"));
const EditUser = lazy(() => import("./pages/User/EditUser"));

const UserPermission = lazy(() => import("./pages/UserPermission"));
const CreateUserPermission = lazy(() =>
  import("./pages/UserPermission/CreateUserPermission")
);
const EditUserPermission = lazy(() =>
  import("./pages/UserPermission/EditUserPermission")
);

const Company = lazy(() => import("./pages/Company"));
const CreateCompany = lazy(() => import("./pages/Company/CreateCompany"));
const EditCompany = lazy(() => import("./pages/Company/EditCompany"));

const CompanyBranch = lazy(() => import("./pages/CompanyBranch"));
const CreateCompanyBranch = lazy(() =>
  import("./pages/CompanyBranch/CreateCompanyBranch")
);
const EditCompanyBranch = lazy(() =>
  import("./pages/CompanyBranch/EditCompanyBranch")
);

const Salesman = lazy(() => import("./pages/Salesman"));

const Customer = lazy(() => import("./pages/Customer"));
const CreateCustomer = lazy(() => import("./pages/Customer/CreateCustomer"));
const EditCustomer = lazy(() => import("./pages/Customer/EditCustomer"));

const Vendor = lazy(() => import("./pages/Vendor"));
const CreateVendor = lazy(() => import("./pages/Vendor/CreateVendor"));
const EditVendor = lazy(() => import("./pages/Vendor/EditVendor"));

const Terms = lazy(() => import("./pages/Terms"));
const Flag = lazy(() => import("./pages/Flag"));
const Class = lazy(() => import("./pages/Class"));

const Vessel = lazy(() => import("./pages/Vessel"));
const CreateVessel = lazy(() => import("./pages/Vessel/CreateVessel"));
const EditVessel = lazy(() => import("./pages/Vessel/EditVessel"));

const Event = lazy(() => import("./pages/Event"));
const CreateEvent = lazy(() => import("./pages/Event/CreateEvent"));
const EditEvent = lazy(() => import("./pages/Event/EditEvent"));

const Category = lazy(() => import("./pages/Category"));
const SubCategory = lazy(() => import("./pages/SubCategory"));
const Brand = lazy(() => import("./pages/Brand"));
const Unit = lazy(() => import("./pages/Unit"));

const Product = lazy(() => import("./pages/Product"));
const CreateProduct = lazy(() => import("./pages/Product/CreateProduct"));
const EditProduct = lazy(() => import("./pages/Product/EditProduct"));

const Validity = lazy(() => import("./pages/Validity"));
const Payment = lazy(() => import("./pages/Payment"));

const Quotation = lazy(() => import("./pages/Quotation"));
const CreateQuotation = lazy(() => import("./pages/Quotation/CreateQuotation"));
const EditQuotation = lazy(() => import("./pages/Quotation/EditQuotation"));

function Routes() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
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
            path: "/user",
            element: (
              <Suspense fallback={<PageLoader />}>
                <User />
              </Suspense>
            ),
          },
          {
            path: "/user/create",
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateUser />
              </Suspense>
            ),
          },
          {
            path: "/user/edit/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditUser />
              </Suspense>
            ),
          },
          {
            path: "/user-permission",
            element: (
              <Suspense fallback={<PageLoader />}>
                <UserPermission />
              </Suspense>
            ),
          },
          {
            path: "/user-permission/create",
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateUserPermission />
              </Suspense>
            ),
          },
          {
            path: "/user-permission/edit/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditUserPermission />
              </Suspense>
            ),
          },
          {
            path: "/company",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Company />
              </Suspense>
            ),
          },
          {
            path: "/company/create",
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateCompany />
              </Suspense>
            ),
          },
          {
            path: "/company/edit/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditCompany />
              </Suspense>
            ),
          },
          {
            path: "/company-branch",
            element: (
              <Suspense fallback={<PageLoader />}>
                <CompanyBranch />
              </Suspense>
            ),
          },
          {
            path: "/company-branch/create",
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateCompanyBranch />
              </Suspense>
            ),
          },
          {
            path: "/company-branch/edit/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditCompanyBranch />
              </Suspense>
            ),
          },
          {
            path: "/salesman",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Salesman />
              </Suspense>
            ),
          },
          {
            path: "/customer",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Customer />
              </Suspense>
            ),
          },
          {
            path: "/customer/create",
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateCustomer />
              </Suspense>
            ),
          },
          {
            path: "/customer/edit/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditCustomer />
              </Suspense>
            ),
          },
          {
            path: "/vendor",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Vendor />
              </Suspense>
            ),
          },
          {
            path: "/vendor/create",
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateVendor />
              </Suspense>
            ),
          },
          {
            path: "/vendor/edit/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditVendor />
              </Suspense>
            ),
          },
          {
            path: "/terms",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Terms />
              </Suspense>
            ),
          },
          {
            path: "/flag",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Flag />
              </Suspense>
            ),
          },
          {
            path: "/class",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Class />
              </Suspense>
            ),
          },
          {
            path: "/vessel",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Vessel />
              </Suspense>
            ),
          },
          {
            path: "/vessel/create",
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateVessel />
              </Suspense>
            ),
          },
          {
            path: "/vessel/edit/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditVessel />
              </Suspense>
            ),
          },
          {
            path: "/product",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Product />
              </Suspense>
            ),
          },
          {
            path: "/product/create",
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateProduct />
              </Suspense>
            ),
          },
          {
            path: "/product/edit/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditProduct />
              </Suspense>
            ),
          },
          {
            path: "/quotation",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Quotation />
              </Suspense>
            ),
          },
          {
            path: "/category",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Category />
              </Suspense>
            ),
          },
          {
            path: "/sub-category",
            element: (
              <Suspense fallback={<PageLoader />}>
                <SubCategory />
              </Suspense>
            ),
          },
          {
            path: "/brand",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Brand />
              </Suspense>
            ),
          },
          {
            path: "/unit",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Unit />
              </Suspense>
            ),
          },
          {
            path: "/event",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Event />
              </Suspense>
            ),
          },
          {
            path: "/event/create",
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateEvent />
              </Suspense>
            ),
          },
          {
            path: "/event/edit/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditEvent />
              </Suspense>
            ),
          },
          {
            path: "/validity",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Validity />
              </Suspense>
            ),
          },
          {
            path: "/payment",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Payment />
              </Suspense>
            ),
          },
          {
            path: "/quotation/create",
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateQuotation />
              </Suspense>
            ),
          },
          {
            path: "/quotation/edit/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditQuotation />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/session",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Session />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
    {
      basename: "/gms/",
    }
  );

  return <RouterProvider router={router} />;
}

export default Routes;
