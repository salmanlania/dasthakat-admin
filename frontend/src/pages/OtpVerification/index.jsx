import { Button } from 'antd';
import toast from 'react-hot-toast';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import LOGO from '../../assets/logo.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { verifyOtpHandler } from '../../store/features/authSlice';
import useError from '../../hooks/useError';
import { sessionSubmit } from '../Session/index';

const OtpVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const handleError = useError();

  const { otpPayload, isVerifyingOtp, userSession, sessionData } = useSelector(
    (state) => state.auth
  );

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const numericValue = pastedData.replace(/\D/g, '');

    if (numericValue.length === 6) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = numericValue[i] || '';
      }
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

    if (!otpPayload) return <Navigate to="/login" />

  const handleChange = (e, index) => {
    const rawValue = e.target.value;
    const value = rawValue.replace(/\D/g, '');

    if (value.length === 6) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = value[i] || '';
      }
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    const key = e.key;

    if (key === 'Backspace' || key === 'Delete') {
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

  const handleSubmit = async (value) => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    } else {
      try {
        const data = {
          email: otpPayload.email,
          password: otpPayload.password,
          company_branch_id: otpPayload.company_branch_id,
          company_id: otpPayload.company_id,
          code: fullOtp
        };
        await dispatch(verifyOtpHandler(data)).unwrap();

        localStorage.setItem('company_id', otpPayload.company_id);
        localStorage.setItem('company_branch_id', otpPayload.company_branch_id);
        toast.success('Login successful');
        navigate('/' , {
          state: {
            prevUrl: location.state?.prevUrl
          }
        });
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const values = {
        company_id: otpPayload.company_id,
        company_branch_id: otpPayload.company_branch_id
      };

      await sessionSubmit(values, dispatch, sessionData, handleError);

      setTimeLeft(300);
      toast.success('OTP resent successfully');

      setOtp(['', '', '', '', '', '']);
    } catch (error) {
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="mx-2 w-[450px] rounded-md border border-gray-300 bg-white px-4 py-6 sm:px-12">
        <div className="mb-4 flex flex-col items-center">
          <img src={LOGO} alt="Logo" className="h-24 rounded-sm object-contain" />
          <p className="mt-2 text-center text-base text-green-600">
            Global Marine Safety - America
          </p>
          <p className="text-sm text-gray-700">Enter the 6-digit OTP sent to your email.</p>
          <div className="mt-2 flex items-center justify-center">
            <div
              className={`text-sm font-medium ${timeLeft <= 60 ? 'text-red-500' : 'text-gray-600'}`}>
              {timeLeft > 0 ? (
                <>OTP expires in: {formatTime(timeLeft)}</>
              ) : (
                <>OTP has expired. Please resend.</>
              )}
            </div>
          </div>
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
              onPaste={idx === 0 ? handlePaste : undefined}
              className="h-12 w-12 rounded border border-gray-300 text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <Button
          type="primary"
          block
          size="large"
          loading={isVerifyingOtp}
          onClick={handleSubmit}
          disabled={timeLeft <= 0}>
          Verify OTP
        </Button>

        <div className="mt-4 text-center">
          <button
            onClick={handleResendOtp}
            disabled={isResending || timeLeft > 0}
            className={`text-sm font-medium ${
              isResending || timeLeft > 0
                ? 'cursor-not-allowed text-gray-400'
                : 'text-blue-600 hover:text-blue-800'
            }`}>
            {isResending ? 'Resending OTP...' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
