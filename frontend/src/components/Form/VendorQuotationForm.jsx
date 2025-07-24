/* eslint-disable react/prop-types */
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Table,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { formatThreeDigitCommas, roundUpto } from '../../utils/number';
import { useSelector } from 'react-redux';

const VendorQuotationForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const {
    initialFormValues,
    quotationDetails,
  } = useSelector((state) => state.quotation);

  useEffect(() => {
    form.setFieldsValue({
      ...initialFormValues,
      req_by: initialFormValues?.req_by || '',
      req_on: initialFormValues?.req_on ? dayjs(initialFormValues.req_on) : null,
      vendor_ref: initialFormValues?.vendor_ref || '',
      status: initialFormValues?.status || '',
      quoted_by: initialFormValues?.quoted_by || '',
      est_unit_weight: initialFormValues?.est_unit_weight || '0.00',
      vendor_name: initialFormValues?.vendor_name || '',
      disc: initialFormValues?.disc || '0.00',
      total: initialFormValues?.total || formatThreeDigitCommas(roundUpto(calculateTotal())) || '0.00',
      address: initialFormValues?.vendor_address || '',
      phone: initialFormValues?.vendor_phone || '',
      fax: initialFormValues?.vendor_fax || '',
      email: initialFormValues?.vendor_email || '',
      comments: initialFormValues?.comments || '',
    });
  }, [initialFormValues, form]);

  const calculateTotal = () => {
    let total = 0;
    quotationDetails.forEach((detail) => {
      total += +detail.net_cost || 0;
    });
    return total;
  };

  const columns = [
    { title: 'Line', dataIndex: 'line', key: 'line', width: 50, render: (text, record, index) => index + 1 },
    { title: 'Qty', dataIndex: 'quantity', key: 'quantity', width: 70, render: (text) => text || '0.00' },
    { title: 'Unit', dataIndex: 'unit', key: 'unit', width: 70, render: (text) => text || '' },
    { title: 'POS/Description', dataIndex: 'description', key: 'description', width: 200, render: (text) => text || '' },
    { title: 'Our Cost %', dataIndex: 'our_cost_percent', key: 'our_cost_percent', width: 100, render: (text) => text || '0.00' },
    { title: 'Net Cost', dataIndex: 'net_cost', key: 'net_cost', width: 100, render: (text) => formatThreeDigitCommas(roundUpto(text || 0)) || '0.00' },
    { title: 'Ext. Cost', dataIndex: 'ext_cost', key: 'ext_cost', width: 100, render: (text, record) => formatThreeDigitCommas(roundUpto((record.quantity || 0) * (record.net_cost || 0))) || '0.00' },
    { title: 'Vendor P/N', dataIndex: 'vendor_part_no', key: 'vendor_part_no', width: 100, render: (text) => text || '' },
    { title: 'Comment', dataIndex: 'comment', key: 'comment', width: 100, render: (text) => text || '' },
    { title: 'Quote Mat #', dataIndex: 'quote_mat_no', key: 'quote_mat_no', width: 100, render: (text) => text || '' },
    { title: 'Max #', dataIndex: 'max_no', key: 'max_no', width: 70, render: (text) => text || '' },
  ];

  const dataSource = quotationDetails.map((detail, index) => ({
    key: index,
    quantity: detail.quantity || '0.00',
    unit: detail.unit_name || '',
    description: detail.product_description || '',
    our_cost_percent: detail.our_cost_percent || '0.00',
    net_cost: detail.net_cost || 0,
    ext_cost: (detail.quantity || 0) * (detail.net_cost || 0),
    vendor_part_no: detail.vendor_part_no || '',
    comment: detail.comment || '',
    quote_mat_no: detail.quote_mat_no || '',
    max_no: detail.max_no || '',
  }));

  return (
    <div className="p-4" style={{ backgroundColor: '#f0f0f0' }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          req_by: initialFormValues?.req_by || '',
          req_on: initialFormValues?.req_on ? dayjs(initialFormValues.req_on) : null,
          vendor_ref: initialFormValues?.vendor_ref || '',
          status: initialFormValues?.status || '',
          quoted_by: initialFormValues?.quoted_by || '',
          est_unit_weight: initialFormValues?.est_unit_weight || '0.00',
          vendor_name: initialFormValues?.vendor_name || '',
          disc: initialFormValues?.disc || '0.00',
          total: initialFormValues?.total || formatThreeDigitCommas(roundUpto(calculateTotal())) || '0.00',
          address: initialFormValues?.vendor_address || '',
          phone: initialFormValues?.vendor_phone || '',
          fax: initialFormValues?.vendor_fax || '',
          email: initialFormValues?.vendor_email || '',
          comments: initialFormValues?.comments || '',
        }}
      >
        <Row gutter={16} align="middle" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #d9d9d9' }}>
          <Col span={6}>
            <Form.Item label="VQ #">
              <Input disabled value={initialFormValues?.document_identity || ''} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Req'd By">
              <Input disabled value={initialFormValues?.req_by || ''} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Req'd On">
              <Input disabled value={initialFormValues?.req_on ? dayjs(initialFormValues.req_on).format('MMM DD YYYY hh:mmA') : ''} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Vendor Ref">
              <Input disabled value={initialFormValues?.vendor_ref || ''} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} align="middle" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #d9d9d9', marginTop: '10px' }}>
          <Col span={12}>
            <Form.Item label="Status">
              <Input disabled value={initialFormValues?.status || ''} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Quoted By">
              <Input disabled value={initialFormValues?.quoted_by || ''} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Est. Unit Weight">
              <Input disabled value={initialFormValues?.est_unit_weight || '0.00'} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} align="middle" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #d9d9d9', marginTop: '10px' }}>
          <Col span={12}>
            <Form.Item label="Vendor">
              <Input disabled value={initialFormValues?.vendor_name || ''} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Disc %">
              <Input disabled value={initialFormValues?.disc || '0.00'} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Total">
              <Input disabled value={initialFormValues?.total || formatThreeDigitCommas(roundUpto(calculateTotal())) || '0.00'} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} align="middle" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #d9d9d9', marginTop: '10px' }}>
          <Col span={24}>
            <Form.Item label="Address">
              <Input.TextArea disabled value={initialFormValues?.vendor_address || ''} autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} align="middle" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #d9d9d9', marginTop: '10px' }}>
          <Col span={6}>
            <Form.Item label="Phone">
              <Input disabled value={initialFormValues?.vendor_phone || ''} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Fax">
              <Input disabled value={initialFormValues?.vendor_fax || ''} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email">
              <Input disabled value={initialFormValues?.vendor_email || ''} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} align="middle" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #d9d9d9', marginTop: '10px' }}>
          <Col span={24}>
            <Form.Item label="Comments">
              <Input.TextArea disabled value={initialFormValues?.comments || ''} autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: 'max-content' }}
          size="small"
          style={{ marginTop: '10px', backgroundColor: '#fff', border: '1px solid #d9d9d9' }}
          rowClassName={(record, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}
        />
        <div style={{ marginTop: '10px', textAlign: 'right' }}>
          <Button type="primary" disabled>
            Close
          </Button>
          <Button type="primary" style={{ marginLeft: '8px' }} disabled>
            Print Grid
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default VendorQuotationForm;