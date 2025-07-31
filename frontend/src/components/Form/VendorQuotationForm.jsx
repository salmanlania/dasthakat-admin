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
import { useSelector } from 'react-redux';
import { formatThreeDigitCommas, roundUpto } from '../../utils/number';
import { useNavigate } from 'react-router-dom';

const VendorQuotationForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [totalExtCost, setTotalExtCost] = useState(0);
  const [finalCost, setFinalCost] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const {
    initialFormValues,
    quotationDetails,
  } = useSelector((state) => state.vendorQuotation);

  useEffect(() => {
    if (!quotationDetails || quotationDetails.length === 0) return;
    console.log('initialFormValues' , initialFormValues)

    let extCostSum = 0;
    let finalCostSum = 0;
    let discountSum = 0;

    quotationDetails.forEach((item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const costPrice = parseFloat(item.cost_price) || 0;
      const discountPercent = parseFloat(item.discount_percent) || 0;

      const netCost = costPrice - ((costPrice * discountPercent) / 100);
      const extCost = netCost * quantity;
      const discountValue = discountPercent || 0;
      const originalFinalCost = costPrice * quantity;

      extCostSum += extCost;
      finalCostSum += originalFinalCost;
      discountSum += discountValue;
    });

    setTotalExtCost(roundUpto(extCostSum));
    setFinalCost(roundUpto(finalCostSum));
    setTotalDiscount(roundUpto(discountSum));

    form.setFieldsValue({
      ...initialFormValues,
      req_by: initialFormValues?.req_by || '',
      req_on: initialFormValues?.req_on ? dayjs(initialFormValues.req_on) : null,
      vendor_ref: initialFormValues?.vendor_ref || '',
      status: initialFormValues?.status || '',
      quoted_by: initialFormValues?.quoted_by || '',
      est_unit_weight: initialFormValues?.est_unit_weight || null,
      vendor_name: initialFormValues?.vendor_name || '',
      disc: initialFormValues?.disc || null,
      total: initialFormValues?.total || formatThreeDigitCommas(roundUpto(totalExtCost)) || null,
      address: initialFormValues?.vendor_address || '',
      phone: initialFormValues?.vendor_phone || '',
      fax: initialFormValues?.vendor_fax || '',
      email: initialFormValues?.vendor_email || '',
      comments: initialFormValues?.comments || '',
    });

    const style = document.createElement('style');
    style.innerHTML = `
    .disabled-row {
      background-color: #f5f5f5 !important;
      color: #999 !important;
      pointer-events: none;
      opacity: 0.6;
    }
  `;
    document.head.appendChild(style);

  }, [initialFormValues, form, quotationDetails]);

  const columns = [
    {
      title: 'S.no',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 50,
      render: (text, record, index) => record?.sort_order + 1 || null
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 70,
      render: (text) => text || null
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
      width: 100, render: (text) => text || null
    },
    {
      title: 'Disc %',
      dataIndex: 'discount_percent',
      key: 'discount_percent',
      width: 100,
      render: (text) => text || null
    },
    {
      title: 'Net Cost',
      dataIndex: 'net_cost',
      key: 'net_cost',
      width: 100,
      render: (_, record) => {
        const cost = parseFloat(record.cost_price) || 0;
        const discount = parseFloat(record.discount_percent) || 0;
        const net = cost - discount// ((cost * discount)) // / 100);
        return formatThreeDigitCommas(roundUpto(net));
      }
    },
    {
      title: 'Ext. Cost',
      dataIndex: 'ext_cost',
      key: 'ext_cost',
      width: 100,
      render: (_, record) => {
        const quantity = parseFloat(record.quantity) || 0;
        const cost = parseFloat(record.cost_price) || 0;
        const discount = parseFloat(record.discount_percent) || 0;
        const net = cost - ((cost * discount) / 100);
        const ext = quantity * net;
        return formatThreeDigitCommas(roundUpto(ext));
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
      dataIndex: 'vendor_notes',
      key: 'vendor_notes',
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
          est_unit_weight: initialFormValues?.est_unit_weight || null,
          vendor_name: initialFormValues?.vendor_name || '',
          disc: initialFormValues?.disc || null,
          total: initialFormValues?.total || formatThreeDigitCommas(roundUpto(totalExtCost)) || null,
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
                <Form.Item label="V.Plat #" style={{ marginBottom: 8 }}>
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
                <Form.Item label="Vendor Reference No" style={{ marginBottom: 8 }}>
                  <Input disabled value={initialFormValues?.vendor_ref_no ? initialFormValues.vendor_ref_no : ''} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Vendor Remarks" style={{ marginBottom: 8 }}>
                  <Input disabled value={initialFormValues?.vendor_remarks ? initialFormValues.vendor_remarks : ''} />
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
                  <Input disabled value={formatThreeDigitCommas(totalExtCost || 0)} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Disc" style={{ marginBottom: 8 }}>
                  <Input disabled value={totalDiscount || 0} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Final Total" style={{ marginBottom: 8 }}>
                  <Input disabled value={formatThreeDigitCommas(finalCost || 0)} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <div
              style={{
                background: '#fff',
                border: '1px solid #d9d9d9',
                padding: '25px',
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

        {
          quotationDetails.length > 0 && (
            <>
              <Table
                columns={columns}
                dataSource={quotationDetails}
                pagination={false}
                scroll={{ x: 'max-content' }}
                rowKey={'id'}
                size="small"
                style={{ marginTop: '10px', backgroundColor: '#fff', border: '1px solid #d9d9d9', borderRadius: '10px !important' }}
                // rowClassName={(record, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}
                rowClassName={(record, index) => {
                  if (record.is_deleted) return 'disabled-row';
                  return index % 2 === 0 ? 'even-row' : 'odd-row';
                }}
              />
              <div style={{ marginTop: '10px', textAlign: 'right' }}>
                <Button type="primary" onClick={() => navigate('/vendor-platform/')}>
                  Close
                </Button>
              </div>
            </>
          )
        }
      </Form>
    </div>
  );
};

export default VendorQuotationForm;