import { Button, Form, Select } from "antd";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import LOGO from "../../assets/logo.jpg";

const Session = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = (values) => {
    console.log(values);
    localStorage.setItem("token", "fake_token"); // replace with actual token
    navigate(location.state?.prevUrl || "/");
    toast.success("Login successful!");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-neutral-50">
      <div className="w-[450px] bg-white border border-gray-300 py-6 sm:px-12 px-4 mx-2 rounded-md">
        <div className="flex flex-col items-center mb-1">
          <img src={LOGO} alt="" className="h-24 object-contain rounded-sm" />
          <p className="text-center text-base mt-2 text-green-1">
            Global Marine Safety - America
          </p>
          <p className="text-sm text-gray-700">Select your session.</p>
        </div>

        <Form
          name="session"
          autoComplete="off"
          layout="vertical"
          onFinish={onSubmit}
        >
          <Form.Item
            label="Company"
            name="company"
            rules={[
              {
                required: true,
                message: "Please select company!",
              },
            ]}
          >
            <Select
              size="large"
              options={[
                {
                  value: "Company 1",
                  label: "Company 1",
                },
                {
                  value: "Company 2",
                  label: "Company 2",
                },
                {
                  value: "Company 3",
                  label: "Company 3",
                },
              ]}
              autoFocus
            />
          </Form.Item>

          <Form.Item
            label="Company Branch"
            name="company_branch"
            rules={[
              {
                required: true,
                message: "Please select company branch!",
              },
            ]}
          >
            <Select
              size="large"
              options={[
                {
                  value: "Branch 1",
                  label: "Branch 1",
                },
                {
                  value: "Branch 2",
                  label: "Branch 2",
                },
                {
                  value: "Branch 3",
                  label: "Branch 3",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Fiscal Year"
            name="fiscal_year"
            rules={[
              {
                required: true,
                message: "Please select fiscal year!",
              },
            ]}
          >
            <Select
              size="large"
              options={[
                {
                  value: "2004 - 2008",
                  label: "2004 - 2008",
                },
                {
                  value: "2008 - 2012",
                  label: "2008 - 2012",
                },
                {
                  value: "2012 - 2012",
                  label: "2012 - 2012",
                },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Session;
