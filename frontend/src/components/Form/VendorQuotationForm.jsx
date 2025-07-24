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

const VendorQuotationForm = () => {
  const [form] = Form.useForm();
  const {
    initialFormValues,
    quotationDetails,
  } = useSelector((state) => state.vendorQuotation);

  useEffect(() => {
    console.log('Initial Form Values:', initialFormValues);
    console.log('quotationDetails:', quotationDetails);
    form.setFieldsValue({
      ...initialFormValues,
      req_by: initialFormValues?.req_by || '',
      req_on: initialFormValues?.req_on ? dayjs(initialFormValues.req_on) : null,
      vendor_ref: initialFormValues?.vendor_ref || '',
      status: initialFormValues?.status || '',
      quoted_by: initialFormValues?.quoted_by || '',
      est_unit_weight: initialFormValues?.est_unit_weight || '0',
      vendor_name: initialFormValues?.vendor_name || '',
      disc: initialFormValues?.disc || '0',
      total: initialFormValues?.total || formatThreeDigitCommas(roundUpto(calculateTotal())) || '0',
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
    {
      title: 'S.no',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 50,
      render: (text, record, index) => record?.sort_order + 1 || index + 1
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 70,
      render: (text) => text || '0'
    },
    {
      title: 'Unit',
      dataIndex: 'unit_id',
      key: 'unit_id',
      width: 70,
      render: (text) => text || ''
    },
    {
      title: 'Description',
      dataIndex: 'product_description',
      key: 'product_description',
      width: 150, render: (text) => text || ''
    },
    {
      title: 'Our Cost',
      dataIndex: 'cost_price',
      key: 'cost_price',
      width: 100, render: (text) => text || '0'
    },
    {
      title: 'Disc %',
      dataIndex: 'discount_percent',
      key: 'discount_percent',
      width: 100,
      render: (text) => text || '0'
    },
    {
      title: 'Net Cost',
      dataIndex: 'net_cost',
      key: 'net_cost',
      width: 100,
      render: (text) => {
        const value = text?.cost_price * text?.discount_percent / 100;
        const finalNetCost = text?.cost_price - value;
        console.log('Net Cost:', finalNetCost);
        return formatThreeDigitCommas(roundUpto(finalNetCost)) || '0';
      }
    },
    {
      title: 'Ext. Cost',
      dataIndex: 'ext_cost',
      key: 'ext_cost',
      width: 100,
      render: (text) => {
        console.log('Ext. Cost:', text);
        const cal = text?.vendorCost * text?.quantity;
        return formatThreeDigitCommas(roundUpto(cal)) || '0'
      }
    },
    {
      title: 'Vendor P/N',
      dataIndex: 'vendor_part_no',
      key: 'vendor_part_no',
      width: 100,
      render: (text) => text || ''
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      width: 100,
      render: (text) => text || ''
    },
  ];

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
          est_unit_weight: initialFormValues?.est_unit_weight || '0',
          vendor_name: initialFormValues?.vendor_name || '',
          disc: initialFormValues?.disc || '0',
          total: initialFormValues?.total || formatThreeDigitCommas(roundUpto(calculateTotal())) || '0',
          address: initialFormValues?.vendor_address || '',
          phone: initialFormValues?.vendor_phone || '',
          fax: initialFormValues?.vendor_fax || '',
          email: initialFormValues?.vendor_email || '',
          comments: initialFormValues?.comments || '',
        }}
      >
        <Row gutter={12} style={{ background: '#fff', border: '1px solid #d9d9d9', padding: '10px', marginLeft: '0 !important', marginRight: '0 !important', borderRadius: '10px' }}>
          <Col span={12}>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="VQ #" style={{ marginBottom: 8 }}>
                  <Input disabled value={initialFormValues?.document_identity || ''} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Quoted By" style={{ marginBottom: 8 }}>
                  <Input disabled value={initialFormValues?.quotation?.document_identity ? initialFormValues?.quotation?.document_identity : ''} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Required Date" style={{ marginBottom: 8 }}>
                  <Input disabled value={initialFormValues?.date_required ? dayjs(initialFormValues.date_required).format('MM-DD-YYYY') : ''} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Returned Date" style={{ marginBottom: 8 }}>
                  <Input disabled value={initialFormValues?.date_returned ? dayjs(initialFormValues.date_returned).format('MM-DD-YYYY') : ''} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item label="Total" style={{ marginBottom: 8 }}>
                  <Input disabled value={initialFormValues?.total || formatThreeDigitCommas(roundUpto(calculateTotal())) || '0'} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Disc" style={{ marginBottom: 8 }}>
                  <Input disabled value={initialFormValues?.total || formatThreeDigitCommas(roundUpto(calculateTotal())) || '0'} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Final Total" style={{ marginBottom: 8 }}>
                  <Input disabled value={initialFormValues?.total || formatThreeDigitCommas(roundUpto(calculateTotal())) || '0'} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <div
              style={{
                background: '#fff',
                border: '1px solid #d9d9d9',
                padding: '10px',
                height: '100%',
                fontSize: '14px',
              }}
            >
              <Row style={{ marginBottom: 6 }}>
                <Col span={8}><strong>Name:</strong></Col>
                <Col span={16}>{initialFormValues?.vendor?.name ? initialFormValues?.vendor?.name : ""}</Col>
              </Row>
              <Row style={{ marginBottom: 6 }}>
                <Col span={8}><strong>Address:</strong></Col>
                <Col span={16}>{initialFormValues?.vendor?.address ? initialFormValues?.vendor?.address : ""}</Col>
              </Row>
              <Row style={{ marginBottom: 6 }}>
                <Col span={8}><strong>City/State:</strong></Col>
                <Col span={16}>{initialFormValues?.vendor?.location ? initialFormValues?.vendor?.location : ""}</Col>
              </Row>
              <Row style={{ marginBottom: 6 }}>
                <Col span={8}><strong>Tel:</strong></Col>
                <Col span={16}>{initialFormValues?.vendor?.contact1 ? initialFormValues?.vendor?.contact1 : ""}</Col>
              </Row>
              <Row style={{ marginBottom: 6 }}>
                <Col span={8}><strong>Fax:</strong></Col>
                <Col span={16}>{initialFormValues?.vendor?.contact2 ? initialFormValues?.vendor?.contact2 : ""}</Col>
              </Row>
              <Row>
                <Col span={8}><strong>Email:</strong></Col>
                <Col span={16}>{initialFormValues?.vendor?.email ? initialFormValues?.vendor?.email : ""}</Col>
              </Row>
            </div>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={quotationDetails}
          pagination={false}
          scroll={{ x: 'max-content' }}
          size="small"
          style={{ marginTop: '10px', backgroundColor: '#fff', border: '1px solid #d9d9d9', borderRadius: '10px !important' }}
          rowClassName={(record, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}
        />
        <div style={{ marginTop: '10px', textAlign: 'right' }}>
          <Button type="primary">
            Close
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default VendorQuotationForm;