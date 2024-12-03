import { Navigate, Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";

const MainLayout = () => {
  const location = useLocation();

  if (!localStorage.getItem("token")) {
    return (
      <Navigate
        to="/login"
        state={{ prevUrl: `${location.pathname}${location.search}` }}
      />
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full min-h-screen">
        <Navbar />
        <main className="flex-1 bg-neutral-50">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};
export default MainLayout;
