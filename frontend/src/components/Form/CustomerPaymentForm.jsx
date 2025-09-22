/* eslint-disable react/prop-types */
import { Button, Col, DatePicker, Form, Input, Row, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useError from '../../hooks/useError';
import { getProduct } from '../../store/features/productSlice';
import { getCustomerLedgerInvoices, setFormField } from '../../store/features/transactionAccountSlice';
import AsyncSelect from '../AsyncSelect';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';

const CustomerPaymentForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, ledgerInvoices, isLedgerLoading } = useSelector(
    (state) => state.transactionAccount
  );

  const DetailSummaryInfo = ({ title, value }) => {
    return (
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">{title}</span>
        <span className="text-sm font-semibold text-black">{value}</span>
      </div>
    );
  };
  // setTotalQuantity

  const [totalAmountDue, setTotalAmountDue] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [submitAction, setSubmitAction] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onFinish = (values) => {
    console.log('selectedRows', selectedRows)
    console.log('values', values)
    const paymentAmount = parseInt(values?.payment_amount ? values?.payment_amount : null)
    console.log('paymentAmount', paymentAmount)
    console.log('totalAmount', totalAmount)
    if (totalAmount != paymentAmount) return toast.error('Total amount must be equal to amount due');

    const formatDate = (date) => (date ? dayjs(date).format('YYYY-MM-DD') : null);

    const data = {
      ...values,
      customer_id: values?.customer_id?.value ? values?.customer_id?.value : values?.customer_id?.key ? values?.customer_id?.key : null,
      total_amount: totalAmount,
      payment_amount: parseInt(values?.payment_amount ? values?.payment_amount : null),
      document_date: formatDate(values.document_date),
      details: selectedRows.map((row, index) => ({
        sale_invoice_id: row?.sale_invoice_id,
        ref_document_identity: row?.document_identity,
        original_amount: row?.net_amount,
        balance_amount: parseInt(row?.balance_amount),
        settled_amount: row?.settled_amount,
        sort_order: index + 1
      }))
    };
    // console.log('data', data)
    // return

    submitAction === 'save' ? onSubmit(data) : submitAction === 'saveAndExit' ? onSave(data) : null;
  };

  // const handleSettledAmountChange = (value) => {
  //   dispatch(setFormField({ field: name, value }));
  // };

  const handleSettledAmountChange = (value, record) => {
    const settledAmount = parseFloat(value.replace(/,/g, '')) || 0;

    console.log(`Updated Settled Amount for Invoice ${record.document_identity}: ${settledAmount}`);

    const updatedRows = selectedRows.map(row =>
      row.sale_invoice_id === record.sale_invoice_id
        ? { ...row, settled_amount: settledAmount }
        : row
    );
    setSelectedRows(updatedRows);
    console.log('SelectedRows', selectedRows)

    const totalSettledAmount = updatedRows.reduce((sum, row) => sum + (row.settled_amount || 0), 0);
    setTotalAmount(totalSettledAmount);

    console.log('Total Settled Amount:', totalSettledAmount);
  };

  useEffect(() => {
    if (selectedRows.length > 0) {
      const totalDue = selectedRows.reduce((sum, row) => sum + (row.balance_amount || 0), 0);
      setTotalAmountDue(totalDue);
    }
  }, [selectedRows]);

  useEffect(() => {
    if (mode === 'edit' && initialFormValues) {
      const customerId = initialFormValues?.customer_id || '';
      // const amount = initialFormValues?.totalAmount || '';
      const customerPoNo = initialFormValues?.customer_po_no || '';
      const eventName = initialFormValues?.event_id || '';
      const vesselName = initialFormValues?.vessel_id || '';
      const customerName = initialFormValues?.customer_id || '';
      const portName = initialFormValues?.port_id || '';
      const refDocumentIdentity = initialFormValues?.ref_document_identity || '';
      const chargeOrderNo = initialFormValues?.charger_order_id || '';
      const billingAddress = initialFormValues?.vessel_billing_address ? initialFormValues?.vessel_billing_address : initialFormValues?.vessel?.billing_address || '';

      // setTotalAmount(amount);
      form.setFieldsValue({
        customer_id: customerId,
        // totalAmount: amount,

        customer_po_no: customerPoNo,
        event_id: eventName,
        vessel_id: vesselName,
        customer_id: customerName,
        charger_order_id: chargeOrderNo,
        port_id: portName,
        vessel_billing_address: billingAddress,
        ref_document_identity: refDocumentIdentity,
        document_date: initialFormValues.document_date
          ? dayjs(initialFormValues.document_date)
          : null,
        required_date: initialFormValues.required_date
          ? dayjs(initialFormValues.required_date)
          : null,
        ship_date: initialFormValues?.ship_date
          ? dayjs(dayjs(initialFormValues.ship_date).format('YYYY-MM-DD'))
          : null,
      });
    }
  }, [initialFormValues, form, mode]);

  const columns = [
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 50
    },
    {
      title: 'Invoice Date',
      dataIndex: 'document_date',
      key: 'document_date',
      render: (_, { document_date }) => {
        return (
          <DebounceInput
            disabled
            value={document_date}
          />
        );
      },
      width: 140
    },
    {
      title: 'Invoice No',
      dataIndex: 'document_identity',
      key: 'document_identity',
      render: (_, { document_identity }) => {
        return (
          <DebounceInput
            disabled
            value={document_identity}
          />
        );
      },
      width: 150
    },
    {
      title: 'Original Amount',
      dataIndex: 'net_amount',
      key: 'net_amount',
      render: (_, { net_amount }, index) => {
        return (
          <DebouncedCommaSeparatedInput
            disabled
            value={net_amount}
          />
        );
      },
      width: 120
    },
    {
      title: 'Balance Amount',
      dataIndex: 'balance_amount',
      key: 'balance_amount',
      render: (_, { balance_amount }) => (
        <DebouncedCommaSeparatedInput value={balance_amount ? balance_amount + '' : ''} disabled />
      ),
      width: 120
    },
    {
      title: 'Settle Amount',
      dataIndex: 'settled_amount',
      key: 'settled_amount',
      render: (_, record) => (
        <DebouncedCommaSeparatedInput
          value={record.settled_amount ? record.settled_amount : ''}
          onChange={(value) => handleSettledAmountChange(value, record)}
        />
      ),
      width: 120
    },
  ];

  return (
    <>
      <Form
        name="customerPayment"
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        initialValues={
          mode === 'edit'
            ? {
              ...initialFormValues
            }
            : { document_date: dayjs() }
        }
        scrollToFirstError>
        {/* Make this sticky */}
        <p className="sticky top-14 z-10 m-auto -mt-8 w-fit rounded border bg-white p-1 px-2 text-xs font-semibold">
          <span className="text-gray-500">Customer Payment No:</span>
          <span
            className={`ml-4 text-amber-600 ${mode === 'edit' ? 'cursor-pointer hover:bg-slate-200' : ''
              } rounded px-1`}
            onClick={() => {
              if (mode !== 'edit') return;
              navigator.clipboard.writeText(initialFormValues?.document_identity);
              toast.success('Copied');
            }}>
            {mode === 'edit' ? initialFormValues?.document_identity : 'AUTO'}
          </span>
        </p>

        <Row gutter={12}>
          <Col span={24} sm={6} md={6} lg={6}>
            <Form.Item
              name="document_date"
              label="Date"
              disabled
              rules={[{ required: true, message: 'date is required' }]}>
              <DatePicker format="MM-DD-YYYY" className="w-full" />
            </Form.Item>
          </Col>
          <Col span={24} sm={6} md={6} lg={6}>
            <Form.Item
              name="customer_id"
              label="Select Customer"
              rules={[{ required: true, message: 'Customer is required' }]}>
              <AsyncSelect
                endpoint="/customer"
                valueKey="customer_id"
                labelKey="name"
                labelInValue
                onChange={(value) => {
                  // form.setFieldsValue({ customer_id: value });
                  if (value?.value) {
                    dispatch(getCustomerLedgerInvoices(value.value));
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24} sm={6} md={6} lg={6}>
            <Form.Item name="payment_amount" label="Receipt Amount">
              <Input />
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
          rowSelection={{
            selectedRowKeys,
            onChange: (newSelectedRowKeys, newSelectedRows) => {
              setSelectedRowKeys(newSelectedRowKeys);
              setSelectedRows(newSelectedRows);
            }
          }}
        />

        <div className="flex justify-end w-full">
          <div className="border rounded-lg bg-white shadow-sm w-full max-w-sm mt-4">
            <div className="flex justify-center -mt-3">
              <span className="bg-cyan-100 text-black px-4 py-1 rounded-full text-sm font-semibold shadow-sm">
                Amount For Selected Invoices
              </span>
            </div>

            <div className="p-4">
              <DetailSummaryInfo
                title="Amount Due"
                // value={formatThreeDigitCommas(totalQuantity || 0)}
                value={totalAmount || "0.00"}
              />
              <DetailSummaryInfo
                title="Applied"
                // value={formatThreeDigitCommas(totalAmount || 0)}
                value={totalAmountDue || "0.00"}
              />
              <DetailSummaryInfo
                title="Discount & Credit Applied"
                // value={formatThreeDigitCommas(initialFormValues?.totalDiscount || 0)}
                value={initialFormValues?.totalDiscount || "0.00"}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Link to="/general-ledger/transactions/customer-payment">
            <Button className="w-28">Exit</Button>
          </Link>
          <Button
            type="primary"
            className="w-28"
            loading={isFormSubmitting && submitAction === 'save'}
            onClick={() => {
              setSubmitAction('save');
              form.submit()
            }}>
            Save
          </Button>
          <Button
            type="primary"
            className="w-28 bg-green-600 hover:!bg-green-500"
            loading={isFormSubmitting && submitAction === 'saveAndExit'}
            onClick={() => {
              setSubmitAction('saveAndExit');
              form.submit();
            }}>
            Save & Exit
          </Button>
        </div>
      </Form>
    </>
  );
};

export default CustomerPaymentForm;