import { Avatar, Button, Dropdown, Form, Input, Modal } from "antd";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdLockOutline, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex items-center gap-2" onClick={handleLogout}>
      <MdLogout size={16} />
      <span>Logout</span>
    </div>
  );
};

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClose = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <>
      <div
        className="flex items-center gap-2"
        onClick={() => setIsModalOpen(true)}
      >
        <MdLockOutline size={16} />
        <span>Update Password</span>
      </div>

      <Modal
        open={isModalOpen}
        footer={null}
        closable={false}
        onCancel={onClose}
      >
        <h4 className="text-lg font-semibold mb-2 text-center">
          Change Password
        </h4>
        <Form
          name="updatePassword"
          layout="vertical"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            name="old_password"
            label="Old Password"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter your old password",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="new_password"
            label="New Password"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter your new password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && getFieldValue("old_password") === value) {
                    return Promise.reject(
                      new Error(
                        "New password cannot be the same as old password!"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            validateFirst
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm_new_password"
            label="Confirm New Password"
            dependencies={["new_password"]}
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter your confirm password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && value !== getFieldValue("new_password")) {
                    return Promise.reject(
                      new Error("Confirm password does not match new password!")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className="flex justify-end gap-4">
            <Button
              className="w-full"
              onClick={() => {
                onClose();
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="w-full">
              Update
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

const ProfileMenu = () => {
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "1",
            label: <ChangePassword />,
          },
          {
            key: "2",
            danger: true,
            label: <Logout />,
          },
        ],
      }}
      arrow
    >
      <Avatar
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww"
        icon={<FaRegUser />}
        size={40}
      />
    </Dropdown>
  );
};

export default ProfileMenu;
