import toast from 'react-hot-toast';
import { CiWifiOff } from 'react-icons/ci';
import { useLocation, useNavigate } from 'react-router-dom';

const useError = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleError = (error, showMessage = true) => {
    const errorMessage = error?.response?.data
    // if:  if user unauthorize then logout and redirect to login page
    // else if: if network error then show error message
    // else: show error message
    if (error?.response?.status === 401) {
      showMessage && toast.error(error?.response?.data?.error || 'You need to login again');
      localStorage.clear();
      navigate('/login', {
        state: { prevUrl: `${location.pathname}${location.search}` }
      });
    } else if (error?.message === 'Network Error') {
      showMessage &&
        toast.error('Please check your internet connection.', {
          icon: <CiWifiOff size={22} strokeWidth={0.4} color="red" />
        });
    } else if (error?.response?.data?.status_code === 500) {
      showMessage && toast.error(error?.response?.data?.message || `We're unable to proceed at the moment. Please get in touch with your administrator for support.`);
    } else if (errorMessage?.error) {
      showMessage && toast.error(errorMessage?.error || `We're unable to proceed at the moment. Please get in touch with your administrator for support.`);
    } else if (errorMessage?.message) {
      showMessage && toast.error(errorMessage?.message || `We're unable to proceed at the moment. Please get in touch with your administrator for support.`);
    } else {
      showMessage &&
        toast.error(
          error?.response?.data?.error ||
          `We're unable to proceed at the moment. Please get in touch with your administrator for support.`
        );
    }
  };

  return handleError;
};

export default useError;
