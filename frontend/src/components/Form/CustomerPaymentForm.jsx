/* eslint-disable react/prop-types */
import { Button, Col, DatePicker, Form, Input, Row, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCustomerLedgerInvoices } from '../../store/features/transactionAccountSlice';
import AsyncSelect from '../AsyncSelect';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';

const CustomerPaymentForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
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

  const [totalAmountDue, setTotalAmountDue] = useState('');
  const [totalSettled, setTotalSettled] = useState(0);
  const [totalAmountVal, setTotalAmountVal] = useState(0);
  const [submitAction, setSubmitAction] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [settledAmounts, setSettledAmounts] = useState({});

  const onFinish = (values) => {
    const paymentAmount = parseInt(values?.payment_amount ? values?.payment_amount : null)
    if (totalSettled != paymentAmount) return toast.error('Total amount must be equal to amount due');

    const formatDate = (date) => (date ? dayjs(date).format('YYYY-MM-DD') : null);

    const data = {
      ...values,
      customer_id: values?.customer_id?.value ? values?.customer_id?.value : values?.customer_id?.key ? values?.customer_id?.key : null,
      total_amount: totalSettled ? totalSettled : totalAmountVal,
      payment_amount: parseInt(values?.payment_amount ? values?.payment_amount : null),
      document_date: formatDate(values.document_date),
      details:
        mode === 'edit' ?
          ledgerInvoices.map((row, index) => {
            const isSelected = selectedRowKeys.includes(row.sale_invoice_id);
            return {
              ...row,
              sale_invoice_id: row?.sale_invoice_id,
              ref_document_identity: row?.document_identity || row?.ref_document_identity,
              ref_document_type_id: row?.document_type_id,
              original_amount: row?.net_amount,
              balance_amount: parseInt(row?.balance_amount),
              settled_amount: settledAmounts[row.sale_invoice_id] || 0,
              sort_order: index + 1,
              row_status: isSelected ? (row?.row_status || "U") : "D"
            };
          })
          : selectedRows.map((row, index) => ({
            ...row,
            sale_invoice_id: row?.sale_invoice_id,
            ref_document_identity: row?.document_identity,
            ref_document_type_id: row?.document_type_id,
            original_amount: row?.net_amount,
            balance_amount: parseInt(row?.balance_amount),
            settled_amount: settledAmounts[row.sale_invoice_id] || 0,
            sort_order: index + 1,
            row_status: row?.row_status
          }))
    };

    submitAction === 'save' ? onSubmit(data) : submitAction === 'saveAndExit' ? onSave(data) : null;
  };

  const handleSettledAmountChange = (value, record) => {
    const rawValue = typeof value === "string" ? value : String(value ?? "0");
    const settledAmount = parseFloat(rawValue.replace(/,/g, "")) || 0

    if (settledAmount > (record.balance_amount || 0)) {
      toast.error("Settled amount cannot be greater than Balance Amount");
      return;
    }

    setSettledAmounts(prev => ({
      ...prev,
      [record.sale_invoice_id]: settledAmount
    }));

    // const totalSettledAmount = selectedRowKeys.reduce((sum, key) => sum + (settledAmounts[key] || settledAmount || 0), 0);
    // setTotalAmount(totalSettledAmount);
  };

  // useEffect(() => {
  //   if (selectedRowKeys.length === 0) return;
  //   if (selectedRowKeys.length > 0) {
  //     const totalSettledAmount = selectedRowKeys.reduce((sum, key) => sum + (settledAmounts[key] || 0), 0);
  //     setTotalAmount(totalSettledAmount);
  //   }
  // }, [selectedRowKeys, settledAmounts]);

  useEffect(() => {
    const total = selectedRowKeys.reduce(
      (sum, key) => sum + (settledAmounts[key] || 0),
      0
    );
    setTotalSettled(total);
  }, [selectedRowKeys, settledAmounts]);

  useEffect(() => {
    if (mode === 'edit' && initialFormValues) {
      const customerId = initialFormValues?.customer_id || '';
      const documentDate = initialFormValues?.document_date ? dayjs(initialFormValues?.document_date) : null;
      const amount = initialFormValues?.total_amount ? initialFormValues?.total_amount : 0
      const paymentAmount = initialFormValues?.payment_amount ? initialFormValues?.payment_amount : null
      const remarks = initialFormValues?.remarks ? initialFormValues?.remarks : null
      setTotalAmountVal(amount)
      form.setFieldsValue({
        customer_id: customerId,
        document_date: documentDate,
        payment_amount: paymentAmount,
        remarks: remarks,
      });

      if (initialFormValues?.details?.length > 0) {
        const keys = initialFormValues.details.map((d) => d.sale_invoice_id);
        setSelectedRowKeys(keys);
        setSelectedRows(initialFormValues.details);

        const settledMap = {};
        initialFormValues.details.forEach((d) => {
          settledMap[d.sale_invoice_id] = d.settled_amount || 0;
        });
        setSettledAmounts(settledMap);
      }
    }
  }, [initialFormValues, form, mode]);

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
      title: 'Original Amount',
      dataIndex: 'net_amount',
      key: 'net_amount',
      render: (_, record, { net_amount }, index) => {
        const documentNetAmount = net_amount ? net_amount : record?.net_amount ? record?.net_amount : ""
        return (
          <DebouncedCommaSeparatedInput
            disabled
            value={documentNetAmount}
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
        <DebouncedCommaSeparatedInput value={record?.balance_amount ? record?.balance_amount + '' : ''} disabled />
      ),
      width: 120
    },
    {
      title: 'Settle Amount',
      dataIndex: 'settled_amount',
      key: 'settled_amount',
      render: (_, record) => {
        const value = settledAmounts[record?.sale_invoice_id] ?? '';
        return (
          <DebouncedCommaSeparatedInput
            value={value ? value : record?.settled_amount}
            onChange={(val) => handleSettledAmountChange(val, record)}
          />
        )
      },
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
              ...initialFormValues,
              document_date: initialFormValues?.document_date
                ? dayjs(initialFormValues.document_date)
                : null,
            }
            : {}
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
              <DatePicker format="MM-DD-YYYY" className="w-full" value={initialFormValues?.document_date ? dayjs(initialFormValues?.document_date) : null} />
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

              setSettledAmounts(prev => {
                const updated = { ...prev };
                newSelectedRows.forEach(row => {
                  if (!(row.sale_invoice_id in updated)) {
                    updated[row.sale_invoice_id] = row.balance_amount || 0;
                  }
                });

                return updated;
              });
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
                // value={mode === 'edit'
                //   ? (selectedRowKeys.length > 0 ? totalAmount : totalAmountVal)
                //   : totalAmount || "0.00"}
                value={totalSettled ? totalSettled : totalAmountVal || "0.00"}
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