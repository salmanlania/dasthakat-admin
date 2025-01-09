import { Button, Form, Select } from 'antd';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import LOGO from '../../assets/logo.jpg';
import { useDispatch, useSelector } from 'react-redux';
import useError from '../../hooks/useError';
import { postSession } from '../../store/features/authSlice';

const Session = () => {
  const handleError = useError();
  const dispatch = useDispatch();
  const location = useLocation();

  const [form] = Form.useForm();
  const companyId = Form.useWatch('company_id', form);

  const navigate = useNavigate();
  const { sessionData, isSessionPosting } = useSelector((state) => state.auth);

  if (!sessionData) return <Navigate to="/login" />;
  const companies = sessionData.company_and_branches;

  const onSubmit = async (values) => {
    try {
      await dispatch(
        postSession({
          ...values,
          email: sessionData.email,
          password: sessionData.password,
          user_id: sessionData.user_id
        })
      ).unwrap();

      localStorage.setItem('company_id', values.company_id);
      localStorage.setItem('company_branch_id', values.company_branch_id);
      toast.success('Login successful');
      navigate(location.state?.prevUrl || '/');
    } catch (error) {
      handleError(error);
    }
  };

  const initialFormValues = {
    company_id: companies[0]?.value,
    company_branch_id: companies[0]?.branches[0]?.value
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="mx-2 w-[450px] rounded-md border border-gray-300 bg-white px-4 py-6 sm:px-12">
        <div className="mb-1 flex flex-col items-center">
          <img src={LOGO} alt="" className="h-24 rounded-sm object-contain" />
          <p className="text-green-1 mt-2 text-center text-base">Global Marine Safety - America</p>
          <p className="text-sm text-gray-700">Select your session.</p>
        </div>

        <Form
          name="session"
          onFinish={onSubmit}
          autoComplete="off"
          form={form}
          layout="vertical"
          initialValues={initialFormValues}
        >
          <Form.Item
            label="Company"
            name="company_id"
            rules={[{ required: true, message: 'Please select a company' }]}
          >
            <Select
              size="large"
              options={companies}
              autoFocus
              onChange={() => form.setFieldsValue({ company_branch_id: null })}
            />
          </Form.Item>

          <Form.Item
            label="Company Branch"
            name="company_branch_id"
            rules={[{ required: true, message: 'Please select a company branch' }]}
          >
            <Select
              size="large"
              disabled={!companyId}
              options={companyId ? companies.find((c) => c.value === companyId)?.branches : null}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={isSessionPosting}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Session;
