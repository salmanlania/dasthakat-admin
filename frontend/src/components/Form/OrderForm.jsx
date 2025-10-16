/* eslint-disable react/prop-types */
import { Button, Col, DatePicker, Form, Input, Row, Table } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebouncedCommaSeparatedInputRate from '../Input/DebouncedCommaSeparatedInputRate';
import DebouncedNumberInputMarkup from '../Input/DebouncedNumberInputMarkup';
import DebounceInput from '../Input/DebounceInput';

export const DetailSummaryInfoCP = ({ title, value, disabled }) => {
  return (
    <div className="grid grid-cols-2 items-center gap-4 mb-2">
      <span className="text-sm text-gray-600">{title}</span>
      <DebouncedCommaSeparatedInputRate
        disabled={disabled}
        className="text-sm font-semibold text-black text-right"
        value={value}
      />
    </div>
  );
};

const OrdersForm = ({ mode, onSave }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [ledgerInvoices, setLedgerInvoices] = useState([])
  const [submitAction, setSubmitAction] = useState(null);

  const onFinish = (values) => {
    const data = {
      ...values,
    };

    submitAction === 'save' ? onSave(data) : null;
  };

  const columns = [
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{record?.sort_order ? record?.sort_order : index + 1}.</>;
      },
      width: 50
    },
    {
      title: 'Invoice Date',
      dataIndex: 'document_date',
      key: 'document_date',
      render: (_, record, { document_date }) => {
        const documentDate = document_date ? dayjs(document_date).format("MM-DD-YYYY") : record?.document_date ? dayjs(record?.document_date).format("MM-DD-YYYY") : ""
        return (
          <DebounceInput
            disabled
            value={documentDate}
          />
        );
      },
      width: 140
    },
    {
      title: 'Invoice No',
      dataIndex: 'document_identity',
      key: 'document_identity',
      render: (_, record, { ref_document_identity }) => {
        const documentIdentity = ref_document_identity ? ref_document_identity : record?.ref_document_identity ? record?.ref_document_identity : record?.document_identity ? record?.document_identity : ""
        return (
          <DebounceInput
            disabled
            value={documentIdentity}
          />
        );
      },
      width: 150
    },
    {
      title: 'Invoice Amount',
      dataIndex: 'net_amount',
      key: 'net_amount',
      render: (_, record, { net_amount }, index) => {
        const documentNetAmount = net_amount ? net_amount : record?.net_amount ? record?.net_amount : ""
        return (
          <DebouncedCommaSeparatedInput
            className="text-right"
            disabled
            value={documentNetAmount && Number(documentNetAmount).toFixed(2)}
          />
        );
      },
      width: 120
    },
    {
      title: 'Balance Amount',
      dataIndex: 'balance_amount',
      key: 'balance_amount',
      render: (_, record) => (
        <DebouncedCommaSeparatedInput
          className="text-right"
          value={record?.balance_amount ? Number(record?.balance_amount).toFixed(2) : ''}
          disabled
        />
      ),
      width: 120
    },
    {
      title: 'Settle Amount',
      dataIndex: 'settled_amount',
      key: 'settled_amount',
      width: 120
    },
  ];

  return (
    <>
      <Form
        name="Orders"
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        initialValues={
          mode === 'edit'
            ? {
              // ...initialFormValues,
              document_date: dayjs()
            }
            : { document_date: dayjs() }
        }
        scrollToFirstError>
        {/* Make this sticky */}
        <p className="sticky top-14 z-10 m-auto -mt-8 w-fit rounded border bg-white p-1 px-2 text-xs font-semibold">
          <span className="text-gray-500">Orders No:</span>
          <span
            className={`ml-4 text-amber-600 ${mode === 'edit' ? 'cursor-pointer hover:bg-slate-200' : ''
              } rounded px-1`}
            onClick={() => {
              if (mode !== 'edit') return;
              // navigator.clipboard.writeText(initialFormValues?.document_identity);
              toast.success('Copied');
            }}>
            {/* {mode === 'edit' ? initialFormValues?.document_identity : 'AUTO'} */}
          </span>
        </p>

        <Row gutter={12}>
          <Col span={24} sm={6} md={6} lg={6}>
            <Form.Item
              name="document_date"
              label="Date"
              disabled
              rules={[{ required: true, message: 'date is required' }]}>
              <DatePicker format="MM-DD-YYYY" className="w-full" value={dayjs()} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24} sm={6} md={6} lg={6}>
            <Form.Item name="payment_amount" label="Payment Amount">
              <DebouncedNumberInputMarkup className="text-right" />
            </Form.Item>
          </Col>
          <Col span={24} sm={6} md={6} lg={6}>
            <Form.Item name="remarks" label="Reference No.">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={ledgerInvoices}
          rowKey={'sale_invoice_id'}
          size="small"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={false}
          sticky={{
            offsetHeader: 56
          }}
        />

        <div className="flex justify-end w-full">
          <div className="border rounded-lg bg-white shadow-sm w-full max-w-sm mt-8 mb-4">
            <div className="flex justify-center -mt-3">
              <span className="bg-cyan-100 text-black px-4 py-1 rounded-full text-sm font-semibold shadow-sm">
                Amount For Selected Invoices
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Link to="/orders">
            <Button className="w-28">Exit</Button>
          </Link>
          <Button
            type="primary"
            className="w-28"
            // loading={isFormSubmitting && submitAction === 'save'}
            onClick={() => {
              setSubmitAction('save');
              form.submit()
            }}>
            Save
          </Button>
          {
            mode === 'edit'
              ? (
                <Button
                  type="primary"
                  className="w-28 bg-indigo-600 hover:!bg-indigo-500"
                >
                  Ledger
                </Button>
              ) : null
          }
        </div>
      </Form>
    </>
  );
};

export default OrdersForm;