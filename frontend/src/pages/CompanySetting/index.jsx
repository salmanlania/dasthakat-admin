import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Select,
  Tabs,
  Form,
  Row,
  Col,
  Typography,
  Spin,
  Checkbox,
  Radio
} from 'antd';
import { FiSend } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCompanySetting,
  updateCompanySetting,
  sendTestEmail
} from '../../store/features/companySetting';
import toast from 'react-hot-toast';
import useError from '../../hooks/useError.jsx';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;
const { Option } = Select;
const { Title } = Typography;

const CompanySetting = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleError = useError();
  const navigate = useNavigate()

  const { initialFormValues, isItemLoading, isTestEmailSending } = useSelector(
    (state) => state.CompanySetting
  );

  const debugChecked = Form.useWatch('debug', form);

  useEffect(() => {
    const fieldKeyMap = {
      smtp_host: 'smtpHostname',
      smtp_user: 'smtpUsername',
      smtp_password: 'smtpPassword',
      email: 'smtpEmail',
      display_name: 'smtpDisplayName',
      debug_email: 'debugEmailAddress',
      smtp_port: 'smtpPort',
      smtp_timeout: 'smtpTimeout',
      mail_type: 'mailEngine',
      smtp_encryption: 'smtpEncryption',
      debug: 'debug',
      whatsapp_token: 'whatsappToken',
      whatsapp_api_url: 'whatsappURL',
    };

    if (initialFormValues && Array.isArray(initialFormValues)) {
      const formValues = initialFormValues.reduce((acc, item) => {
        const formKey = fieldKeyMap[item.field];
        if (formKey) {
          acc[formKey] = item.field === 'debug' ? item.value === '1' : item.value;
        }
        return acc;
      }, {});

      form.setFieldsValue(formValues);
    }
  }, [initialFormValues, form]);

  useEffect(() => {
    dispatch(getCompanySetting());
  }, [dispatch]);

  const onFinish = async (values) => {
    try {
      const mail = {
        smtp_host: values.smtpHostname,
        smtp_user: values.smtpUsername,
        smtp_password: values.smtpPassword,
        display_name: values.smtpDisplayName,
        email: values.smtpEmail,
        smtp_port: values.smtpPort,
        smtp_timeout: values.smtpTimeout,
        mail_type: values.mailEngine,
        smtp_encryption: values.smtpEncryption,
        debug: values.debug ? '1' : '0'
      };

      if (values.debug) {
        mail.debug_email = values.debugEmailAddress;
      }

      const whatsapp = {
        whatsapp_token : values.whatsappToken,
        whatsapp_api_url : values.whatsappURL,
      };

      const data = {
        mail,
        whatsapp
      };
      await dispatch(updateCompanySetting(data)).unwrap();
      toast.success('Update Setting Successfully!');
      dispatch(getCompanySetting()).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const sendDebugEmail = async () => {
    const debugEmail = form.getFieldValue('debugEmailAddress');
    if (debugEmail) {
      try {
        await dispatch(sendTestEmail({ debugEmail })).unwrap();
        toast.success('Test email sent successfully!');
      } catch (error) {
        handleError(error);
      }
    }
  };

  const dashboardRedirection = ()=>{
    navigate('/')
  }

  return (
    <Spin spinning={isItemLoading}>
      <div className="min-h-screen bg-white">
        <div className="px-6 py-4">
          <Title level={4} className="mb-1">
            Core Setting
          </Title>
          <div className="mb-4 text-sm text-gray-500">
            <span>Home</span> <span className="mx-1">/</span> <span>Setup</span>{' '}
            <span className="mx-1">/</span> <span>Core Setting</span>
          </div>
        </div>

        <div className="mb-4 flex justify-end px-6">
          <Button className="mr-2" onClick={dashboardRedirection}>Exit</Button>
          <Button type="primary" onClick={() => form.submit()}>Save</Button>
        </div>

        <div className="px-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              mailEngine: 'Mail'
            }}>
            <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6" type="card">
              <TabPane tab="Email Setting" key="1">
                <div className="rounded border border-gray-200 bg-white p-6">
                  <Form.Item label="Mail Engine" name="mailEngine" className="mb-6">
                    <Select className="w-full">
                      <Option value="Mail">Mail</Option>
                      <Option value="SMTP">SMTP</Option>
                    </Select>
                  </Form.Item>

                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item label="SMTP Email Address" name="smtpEmail">
                        <Input placeholder="Email Address" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="SMTP Display Name" name="smtpDisplayName">
                        <Input placeholder="Display Name" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item label="SMTP Hostname" name="smtpHostname">
                        <Input placeholder="Hostname" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="SMTP Username" name="smtpUsername">
                        <Input placeholder="Username" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item label="SMTP Password" name="smtpPassword">
                        <Input.Password placeholder="Password" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="SMTP Port" name="smtpPort">
                        <Input placeholder="Port" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item label="SMTP Encryption" name="smtpEncryption">
                        <Radio.Group>
                          <Radio value="tls">TLS</Radio>
                          <Radio value="ssl">SSL</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="SMTP Timeout" name="smtpTimeout">
                        <Input placeholder="Timeout" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col
                      span={12}
                      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Form.Item
                        name="debug"
                        valuePropName="checked"
                        className="mb-4"
                        style={{ marginBottom: 0 }}>
                        <Checkbox>Enable Debug Email</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      {debugChecked && (
                        <Form.Item label="Debug Email Address" name="debugEmailAddress">
                          <Input
                            placeholder="Enter email address"
                            suffix={
                              <Spin spinning={isTestEmailSending}>
                                <FiSend
                                  type="primary"
                                  onClick={sendDebugEmail}
                                  className="flex cursor-pointer items-center"
                                />
                              </Spin>
                            }
                          />
                        </Form.Item>
                      )}
                    </Col>
                  </Row>
                </div>
              </TabPane>
              <TabPane tab="WhatsApp Setting" key="2">
                <div className="rounded border border-gray-200 bg-white p-6">
                  <Row gutter={[16, 16]} align="middle" justify="start">
                    <Col xs={24} sm={12} style={{ display: 'flex', flexDirection: 'column' }}>
                      <Form.Item label="WhatsApp Token" name="whatsappToken">
                        <Input placeholder="Enter WhatsApp Token" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]} align="middle" justify="start">
                    <Col xs={24} sm={12} style={{ display: 'flex', flexDirection: 'column' }}>
                      <Form.Item label="WhatsApp URL" name="whatsappURL">
                        <Input placeholder="Enter WhatsApp Name" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </TabPane>
            </Tabs>
          </Form>
        </div>

        <div className="mt-6 flex justify-end px-6 py-4">
          <Button className="mr-2" onClick={dashboardRedirection}>Exit</Button>
          <Button type="primary" onClick={() => form.submit()}>
            Save
          </Button>
        </div>
      </div>
    </Spin>
  );
};

export default CompanySetting;
