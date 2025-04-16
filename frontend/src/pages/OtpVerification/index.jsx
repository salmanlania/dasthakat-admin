import { Button } from 'antd';
import toast from 'react-hot-toast';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import LOGO from '../../assets/logo.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import { postSession } from '../../store/features/authSlice';
import useError from '../../hooks/useError';

const OtpVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const handleError = useError();

  const { sessionData, isSessionPosting } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  if (!sessionData) return <Navigate to="/login" />;

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ''); // Only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    const key = e.key;

    if ((key === 'Backspace' || key === 'Delete')) {
      if (otp[index] === '') {
        const prevIndex = index > 0 ? index - 1 : 0;
        const newOtp = [...otp];
        newOtp[prevIndex] = '';
        setOtp(newOtp);
        inputRefs.current[prevIndex]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }

    if (key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }else{
        toast.success('succesfully login')
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="mx-2 w-[450px] rounded-md border border-gray-300 bg-white px-4 py-6 sm:px-12">
        <div className="mb-4 flex flex-col items-center">
          <img src={LOGO} alt="Logo" className="h-24 rounded-sm object-contain" />
          <p className="mt-2 text-center text-base text-green-600">Global Marine Safety - America</p>
          <p className="text-sm text-gray-700">Enter the 6-digit OTP sent to your email.</p>
        </div>

        <div className="mb-4 flex justify-between gap-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-12 h-12 text-center border border-gray-300 rounded text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <Button
          type="primary"
          block
          size="large"
          loading={isSessionPosting}
          onClick={handleSubmit}
        >
          Verify OTP
        </Button>
      </div>
    </div>
  );
};

export default OtpVerification;