/* eslint-disable react/prop-types */
import { Button, Col, DatePicker, Form, Input, Row, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addCustomerPaymentSettlementDetail, changeCustomerPaymentSettlementDetailOrder, updateCustomerPaymentSettlementDetail } from '../../store/features/customerPaymentSettlementSlice';
import AsyncSelect from '../AsyncSelect';
import AsyncSelectProduct from '../AsyncSelectProduct';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';
import LedgerModal from '../Modals/LedgerModal';

const CustomerPaymentSettlementForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, customerPaymentSettlementDetails, customerPaymentSettlementPayments } = useSelector(
    (state) => state.customerPaymentSettlement
  );

  const [submitAction, setSubmitAction] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [totalSettled, setTotalSettled] = useState(0.00);
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const merged = [...customerPaymentSettlementPayments, ...customerPaymentSettlementDetails]
    setFinalData(merged)
    const total = merged.reduce(
      (sum, row) => sum + (parseFloat(row?.amount) || 0),
      0
    );

    setTotalSettled(total);
    setCustomerId(initialFormValues?.customerId || null);

  }, [customerPaymentSettlementDetails, customerPaymentSettlementPayments, setFinalData]);

  const onFinish = (values) => {
    const data = {
      ...initialFormValues,
      ...values,
      transaction_account_id: values?.transaction_account_id ? values?.transaction_account_id?.value || values?.transaction_account_id : null,
      customer_payment_id: values?.customer_payment_id ? values?.customer_payment_id?.value || values?.customer_payment_id : null,
      customer_id: values?.customer_id ? values?.customer_id?.value || values?.customer_id : null,
      total_amount: Number(values?.total_amount || 0),
      bank_amount: Number(values?.total_amount || 0) - totalSettled,
      customer_payment_account_id: selectedPayment?.transaction_account_id ? selectedPayment?.transaction_account_id : mode === 'edit' ? initialFormValues?.customer_payment_account_id : null,
      document_date: values?.document_date ? dayjs(values?.document_date).format("YYYY-MM-DD") : null,
      details: finalData.map((row, index) => ({
        ...row,
        sort_order: index + 1,
        account_id: row?.account_id ? row?.account_id?.value || row?.account_id : null,
        cheque_date: row?.cheque_date ? dayjs(row?.cheque_date).format("YYYY-MM-DD") : null,
        cheque_date: row?.cheque_date ? dayjs(row?.cheque_date).format("YYYY-MM-DD") : null,
        customer_payment_id: row?.customer_payment_id ? row?.customer_payment_id : null
      }))
    };

    submitAction === 'save'
      ? onSubmit(data)
      : submitAction === 'saveAndExit'
        ? onSave(data)
        : null;
  };

  const columns = [
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addCustomerPaymentSettlementDetail())}
        />
      ),
      key: 'order',
      dataIndex: 'order',
      render: (_, record, index) => {
        return (
          <div className="flex flex-col gap-1">
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropup size={16} />}
              disabled={index === 0}
              onClick={() => {
                dispatch(changeCustomerPaymentSettlementDetailOrder({ from: index, to: index - 1 }));
              }}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
              onClick={() => {
                dispatch(changeCustomerPaymentSettlementDetailOrder({ from: index, to: index + 1 }));
              }}
            />
          </div>
        );
      },
      width: 50,
      fixed: 'left'
    },
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 50,
    },
    {
      title: "Accounts",
      dataIndex: "account_id",
      key: "account_id",
      render: (val, record) => {
        return (
          <AsyncSelect
            endpoint="/accounts?only_leaf=1"
            valueKey="account_id"
            labelKey="name"
            value={record?.account_id}
            disabled={record?.disabled || record?.customer_payment_id || record?.customer_payment_id === ""}
            onChange={(newVal) => {
              if (!newVal) {
                dispatch(updateCustomerPaymentSettlementDetail({
                  id: record.id,
                  field: "account_id",
                  value: null,
                }));
                return;
              }
              dispatch(updateCustomerPaymentSettlementDetail({
                id: record.id,
                field: "account_id",
                value: newVal,
              }));
            }}
            style={{ width: "100%" }}
          />
        );
      },
      width: 500,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      width: 350,
      render: (val, record) => {
        return (
          <Input
            value={val || ""}
            onChange={(e) =>
              dispatch(updateCustomerPaymentSettlementDetail({
                id: record.id,
                field: "remarks",
                value: e.target.value,
              }))
            }
          />
        )
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 350,
      render: (_, record) => (
        <DebouncedCommaSeparatedInput
          className="text-right"
          value={record.amount}
          disabled={record?.disabled || record?.customer_payment_id || record?.customer_payment_id === ""}
          onChange={(val) => {
            const rawValue = String(val ?? "0");
            const clean = parseFloat(rawValue.replace(/,/g, "")) || 0;

            dispatch(updateCustomerPaymentSettlementDetail({
              id: record.id,
              field: "amount",
              value: clean,
            }));
          }}
        />
      ),
    },
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addCustomerPaymentSettlementDetail())}
        />
      ),
      key: 'action',
      width: 50,
      fixed: 'right'
    }
  ];

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={
          mode === "edit"
            ? {
              ...initialFormValues,
              document_date: initialFormValues?.document_date
                ? dayjs(initialFormValues.document_date)
                : null
            }
            : { document_date: dayjs() }
        }
      >
        <p className="sticky top-14 z-10 m-auto -mt-8 w-fit rounded border bg-white p-1 px-2 text-xs font-semibold mb-4">
          <span className="text-gray-500">Customer Payment Settlement No:</span>
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
          <Col span={6}>
            <Form.Item label="Document No">
              <Input disabled value={mode === "edit" ? initialFormValues?.document_identity : "AUTO"} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="document_date"
              label="Document Date"
              rules={[{ required: true, message: "Date is required" }]}
            >
              <DatePicker format="MM-DD-YYYY" className="w-full" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="customer_id"
              label="Select Customer"
            >
              <AsyncSelectProduct
                key="customer_select"
                endpoint="/customer"
                valueKey="customer_id"
                labelKey="name"
                labelInValue
                onChange={(value) => {
                  const selectedCustomerId = value?.value || null;
                  setCustomerId(selectedCustomerId);

                  if (!selectedCustomerId) {
                    form.setFieldsValue({ customer_payment_id: null, total_amount: null });
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="customer_payment_id"
              label="Customer Payment"
              rules={[{ required: true, message: "Customer Payment is required" }]}
            >
              <AsyncSelectProduct
                endpoint={`/customer/${customerId}/payments`}
                key={customerId}
                className="w-full"
                disabled={!customerId}
                valueKey="customer_payment_id"
                labelKey="document_identity"
                allowClear
                labelInValue
                onChange={(value, option) => {
                  setSelectedPayment(option);
                  form.setFieldsValue({
                    total_amount: Number(option?.total_amount).toFixed(2),
                  });
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Form.Item name="total_amount" label="Amount">
              <DebouncedCommaSeparatedInput disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="transaction_no" label="Transaction No">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="remarks" label="Memo">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="transaction_account_id"
              label="Deposit To"
              rules={[{ required: true, message: "Deposit to is required" }]}
            >
              <AsyncSelectProduct
                endpoint="/accounts?only_leaf=1"
                // size="small"
                className="w-full"
                valueKey="account_id"
                labelKey="name"
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={finalData}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 'calc(100% - 200px)' }}
          summary={() => {
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2} className="tracking-wide font-bold">Deposited Sub Total</Table.Summary.Cell>
                  <Table.Summary.Cell index={2} />
                  {/* <Table.Summary.Cell index={3} /> */}
                  <Table.Summary.Cell index={3} colSpan={2} className="text-right font-bold">{totalSettled.toFixed(2)}</Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />

        <div className="mt-4 flex items-center justify-end gap-2">
          <Link to="/general-ledger/transactions/customer-payment-settlement">
            <Button className="w-28">Exit</Button>
          </Link>
          <Button
            type="primary"
            className="w-28"
            loading={isFormSubmitting && submitAction === "save"}
            onClick={() => {
              setSubmitAction("save");
              form.submit();
            }}
          >
            Save
          </Button>
          <Button
            type="primary"
            className="w-28 bg-green-600 hover:!bg-green-500"
            loading={isFormSubmitting && submitAction === "saveAndExit"}
            onClick={() => {
              setSubmitAction("saveAndExit");
              form.submit();
            }}
          >
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

export default CustomerPaymentSettlementForm;