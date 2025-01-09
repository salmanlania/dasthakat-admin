import { Button, Form, Input } from 'antd';
import { FaRegUser } from 'react-icons/fa6';
import { MdLockOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import LOGO from '../../assets/logo.jpg';
import useError from '../../hooks/useError';
import { loginHandler } from '../../store/features/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggingIn } = useSelector((state) => state.auth);

  const onSubmit = async (values) => {
    try {
      await dispatch(loginHandler(values)).unwrap();
      navigate('/session', {
        state: {
          prevUrl: location.state?.prevUrl
        }
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="mx-2 w-[450px] rounded-md border border-gray-300 bg-white px-4 py-6 sm:px-12">
        <div className="mb-1 flex flex-col items-center">
          <img src={LOGO} alt="" className="h-24 rounded-sm object-contain" />
          <p className="text-green-1 mt-2 text-center text-base">Global Marine Safety - America</p>
          <p className="text-sm text-gray-700">Login to your account.</p>
        </div>

        <Form name="login" autoComplete="off" layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please enter your email!'
              },
              {
                type: 'email',
                message: 'Please enter a valid email!'
              }
            ]}
          >
            <Input
              size="large"
              autoFocus
              prefix={<FaRegUser size={18} className="text-gray-500" />}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please enter your password!'
              },
              {
                whitespace: true
              }
            ]}
          >
            <Input.Password
              size="large"
              prefix={<MdLockOutline size={18} className="text-gray-500" />}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={isLoggingIn}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
