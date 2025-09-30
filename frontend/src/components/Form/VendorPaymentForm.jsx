/* eslint-disable react/prop-types */
import { Button, Col, DatePicker, Form, Input, Row, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getVendorLedgerInvoices, updateVendorPaymentDetail } from '../../store/features/vendorPaymentSlice';
import AsyncSelect from '../AsyncSelect';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';
import DebouncedCommaSeparatedInputRate from '../Input/DebouncedCommaSeparatedInputRate';
import LedgerModal from '../Modals/LedgerModal';

const VendorPaymentForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, ledgerInvoices, isLedgerLoading } = useSelector(
    (state) => state.vendorPayment
  );

  const DetailSummaryInfo = ({ title, value, disabled }) => {
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

  const [totalAmountDue, setTotalAmountDue] = useState('');
  const [totalSettled, setTotalSettled] = useState(0);
  const [totalAmountVal, setTotalAmountVal] = useState(0);
  const [submitAction, setSubmitAction] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [settledAmounts, setSettledAmounts] = useState({});
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);

  const onFinish = (values) => {
    const normalize = (num) => Number(parseFloat(num).toFixed(2));
    const paymentAmount = normalize(values?.payment_amount ? values?.payment_amount : null)
    const settledAmount = normalize(totalSettled);
    if (settledAmount != paymentAmount) return toast.error('Total amount must be equal to amount due');

    const formatDate = (date) => (date ? dayjs(date).format('YYYY-MM-DD') : null);

    const data = {
      ...initialFormValues,
      ...values,
      supplier_id: values?.supplier_id?.value ? values?.supplier_id?.value : values?.supplier_id?.key ? values?.supplier_id?.key : null,
      transaction_account_id: values?.transaction_account_id?.value ? values?.transaction_account_id?.value : values?.transaction_account_id?.key ? values?.transaction_account_id?.key : null,
      total_amount: totalSettled ? totalSettled : totalAmountVal,
      payment_amount: paymentAmount,
      document_date: formatDate(values.document_date),
      details:
        mode === 'edit' ?
          ledgerInvoices.map((row, index) => {
            const isSelected = selectedRowKeys.includes(row?.purchase_invoice_id);
            return {
              ...row,
              purchase_invoice_id: row?.purchase_invoice_id,
              ref_document_identity: row?.document_identity || row?.ref_document_identity,
              ref_document_type_id: row?.document_type_id,
              original_amount: row?.net_amount,
              balance_amount: parseInt(row?.balance_amount),
              settled_amount: settledAmounts[row.purchase_invoice_id] || 0,
              account_id: row?.account_id ? row?.account_id?.value || row?.account_id : null,
              sort_order: index + 1,
              row_status: isSelected ? (row?.row_status || "U") : "D"
            };
          })
          : selectedRows.map((row, index) => ({
            ...row,
            purchase_invoice_id: row?.purchase_invoice_id,
            ref_document_identity: row?.document_identity,
            ref_document_type_id: row?.document_type_id,
            original_amount: row?.net_amount,
            balance_amount: parseInt(row?.balance_amount),
            settled_amount: settledAmounts[row.purchase_invoice_id] || 0,
            sort_order: index + 1,
            row_status: row?.row_status
          }))
    };

    submitAction === 'save' ? onSubmit(data) : submitAction === 'saveAndExit' ? onSave(data) : null;
  };

  const handleSettledAmountChange = (value, record) => {
    const rawValue = typeof value === "string" ? value : String(value ?? "0");
    const settledAmount = parseFloat(rawValue.replace(/,/g, "")) || 0

    if (settledAmount > (Number(record?.balance_amount || 0))) {
      toast.error("Settled amount cannot be greater than Balance Amount");
      return;
    }

    setSettledAmounts(prev => ({
      ...prev,
      [record.purchase_invoice_id]: settledAmount
    }));
  };

  useEffect(() => {
    const total = selectedRowKeys.reduce(
      (sum, key) => sum + Number(settledAmounts[key] || 0),
      0
    );
    setTotalSettled(total);

    const receiptAmount = form.getFieldValue("payment_amount");

    if (total && total !== receiptAmount) {
      form.setFieldsValue({
        payment_amount: Number(total).toFixed(2),
      });
    }

  }, [selectedRowKeys, settledAmounts]);

  useEffect(() => {
    if (mode === 'edit' && initialFormValues) {
      const vendorId = initialFormValues?.supplier_id || '';
      const documentDate = initialFormValues?.document_date ? dayjs(initialFormValues?.document_date) : null;
      const amount = initialFormValues?.total_amount ? initialFormValues?.total_amount : 0
      const paymentAmount = initialFormValues?.payment_amount ? initialFormValues?.payment_amount : null
      const remarks = initialFormValues?.remarks ? initialFormValues?.remarks : null
      setTotalAmountVal(amount)
      form.setFieldsValue({
        supplier_id: vendorId,
        document_date: documentDate,
        payment_amount: paymentAmount,
        remarks: remarks,
      });

      if (initialFormValues?.details?.length > 0) {
        const keys = initialFormValues.details.map((d) => d.purchase_invoice_id);
        setSelectedRowKeys(keys);
        setSelectedRows(initialFormValues.details);

        const settledMap = {};
        initialFormValues.details.forEach((d) => {
          settledMap[d.purchase_invoice_id] = d.settled_amount || 0;
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
      render: (_, record) => {
        const value = settledAmounts[record?.purchase_invoice_id] ?? '';
        return (
          <DebouncedCommaSeparatedInputRate
            className="text-right"
            value={value ? Number(value).toFixed(2) : Number(record?.settled_amount).toFixed(2) ? record?.settled_amount : null}
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
        name="vendorPayment"
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
            : { document_date: dayjs() }
        }
        scrollToFirstError>
        {/* Make this sticky */}
        <p className="sticky top-14 z-10 m-auto -mt-8 w-fit rounded border bg-white p-1 px-2 text-xs font-semibold">
          <span className="text-gray-500">Vendor Payment No:</span>
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
              name="supplier_id"
              label="Select Vendor"
              rules={[{ required: true, message: 'Vendor is required' }]}>
              <AsyncSelect
                endpoint="/supplier"
                valueKey="supplier_id"
                labelKey="name"
                labelInValue
                onChange={(value) => {
                  if (value?.value) {
                    dispatch(getVendorLedgerInvoices(value.value));
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={6} md={6} lg={6}>
            <Form.Item
              name="transaction_account_id"
              label="Select Bank"
            // rules={[{ required: true, message: 'Vendor is required' }]}
            >
              <AsyncSelect
                endpoint="/accounts?only_leaf=1"
                valueKey="account_id"
                labelKey="name"
                labelInValue
                // value={record?.account_id}
                style={{ width: "100%" }}
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
          rowKey={'purchase_invoice_id'}
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
                  if (!(row.purchase_invoice_id in updated)) {
                    updated[row.purchase_invoice_id] = row.balance_amount || 0;
                  }
                });

                return updated;
              });
            }
          }}
        />

        <div className="flex justify-end w-full">
          <div className="border rounded-lg bg-white shadow-sm w-full max-w-sm mt-8 mb-4">
            <div className="flex justify-center -mt-3">
              <span className="bg-cyan-100 text-black px-4 py-1 rounded-full text-sm font-semibold shadow-sm">
                Amount For Selected Invoices
              </span>
            </div>

            <div className="p-4">
              <DetailSummaryInfo
                title="Amount Due"
                disabled
                value={
                  (totalSettled || totalAmountVal)
                    ? (Number(totalSettled || totalAmountVal)).toFixed(2)
                    : "0.00"
                }
              />
              <DetailSummaryInfo
                title="Applied"
                disabled
                value={totalAmountDue || "0.00"}
              />
              <DetailSummaryInfo
                title="Discount & Credit Applied"
                disabled
                value={initialFormValues?.totalDiscount || "0.00"}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Link to="/general-ledger/transactions/vendor-payment">
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
          {
            mode === 'edit'
              ? (
                <Button
                  type="primary"
                  className="w-28 bg-indigo-600 hover:!bg-indigo-500"
                  onClick={() => setLedgerModalOpen(true)}
                >
                  Ledger
                </Button>
              ) : null
          }
        </div>
      </Form>

      {/* Modals */}

      <LedgerModal
        open={ledgerModalOpen}
        initialFormValues={initialFormValues}
        onClose={() => setLedgerModalOpen(false)}
      />
    </>
  );
};

export default VendorPaymentForm;