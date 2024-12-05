import { Button, Form, Input } from "antd";
import { FaRegUser } from "react-icons/fa6";
import { MdLockOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import LOGO from "../../assets/logo.jpg";
import useError from "../../hooks/useError";
import { loginHandler } from "../../store/features/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggingIn } = useSelector((state) => state.auth);

  const onSubmit = async (values) => {
    try {
      await dispatch(loginHandler(values)).unwrap();
      navigate("/session", {
        state: {
          prevUrl: location.state?.prevUrl,
        },
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-neutral-50">
      <div className="w-[450px] bg-white border border-gray-300 py-6 sm:px-12 px-4 mx-2 rounded-md">
        <div className="flex flex-col items-center mb-1">
          <img src={LOGO} alt="" className="h-24 object-contain rounded-sm" />
          <p className="text-center text-base mt-2 text-green-1">
            Global Marine Safety - America
          </p>
          <p className="text-sm text-gray-700">Login to your account.</p>
        </div>

        <Form
          name="login"
          autoComplete="off"
          layout="vertical"
          onFinish={onSubmit}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email!",
              },
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
                message: "Please enter your password!",
              },
              {
                whitespace: true,
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<MdLockOutline size={18} className="text-gray-500" />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isLoggingIn}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
