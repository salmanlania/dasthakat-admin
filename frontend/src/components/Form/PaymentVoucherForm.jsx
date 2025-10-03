/* eslint-disable react/prop-types */
import { Button, Col, DatePicker, Dropdown, Form, Input, Row, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addPaymentVoucherDetail, changePaymentVoucherDetailOrder, updatePaymentVoucherDetail, removePaymentVoucherDetail, copyPaymentVoucherDetail } from '../../store/features/paymentVoucherSlice';
import AsyncSelect from '../AsyncSelect';
import AsyncSelectPaymentVoucher from '../AsyncSelectPaymentVoucher';
import AsyncSelectProduct from '../AsyncSelectProduct';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';
import LedgerModal from '../Modals/LedgerModal';

const PaymentVoucherForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, paymentVoucherDetails } = useSelector(
    (state) => state.paymentVoucher
  );

  const [submitAction, setSubmitAction] = useState(null);
  const [settledAmounts, setSettledAmounts] = useState({});
  const [totalSettled, setTotalSettled] = useState(0);
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);

  const onFinish = (values) => {
    const checkDate = paymentVoucherDetails.map((row) => row.ledger_date ? row.ledger_date : null);
    if (checkDate.includes(null)) {
      toast.error("Transaction Date is required");
      return;
    }
    const data = {
      ...initialFormValues,
      ...values,
      transaction_account_id: values?.transaction_account_id ? values?.transaction_account_id?.value || values?.transaction_account_id : null,
      total_amount: totalSettled,
      net_amount: totalSettled + 100,
      document_date: values?.document_date ? dayjs(values?.document_date).format("YYYY-MM-DD") : null,
      details: paymentVoucherDetails.map((row, index) => ({
        ...row,
        sort_order: index + 1,
        account_id: row?.account_id ? row?.account_id?.value || row?.account_id : null,
        cost_center_id: row?.cost_center_id ? row?.cost_center_id?.value || row?.cost_center_id : null,
        event_id: row?.event_id ? row?.event_id?.value || row?.event_id : null,
        supplier_id: row?.supplier_id ? row?.supplier_id?.value || row?.supplier_id : null,
        cheque_date: row?.cheque_date ? dayjs(row?.cheque_date).format("YYYY-MM-DD") : null,
        ledger_date: row?.ledger_date ? dayjs(row?.ledger_date).format("YYYY-MM-DD") : null,
      }))
    };
    submitAction === 'save'
      ? onSubmit(data)
      : submitAction === 'saveAndExit'
        ? onSave(data)
        : null;
  };

  useEffect(() => {
    const total = paymentVoucherDetails.reduce((sum, row) => {
      const settled = settledAmounts[row.id] ?? row.payment_amount ?? 0;
      return sum + (Number(settled) || 0);
    }, 0);

    setTotalSettled(total);
  }, [paymentVoucherDetails, settledAmounts]);

  const columns = [
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addPaymentVoucherDetail())}

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
                dispatch(changePaymentVoucherDetailOrder({ from: index, to: index - 1 }));
              }}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
              onClick={() => {
                dispatch(changePaymentVoucherDetailOrder({ from: index, to: index + 1 }));
              }}
            />
          </div>
        );
      },
      width: 50,
      fixed: 'left'
    },
    {
      title: "Vendor",
      dataIndex: "supplier_id",
      key: "supplier_id",
      width: 250,
      render: (val, record) => (
        <AsyncSelectPaymentVoucher
          key={record.id}
          endpoint="/supplier"
          size="medium"
          className="w-full font-normal"
          valueKey="supplier_id"
          labelKey="name"
          value={val}
          allowClear
          onChange={(newVal, supplier) => {
            dispatch(updatePaymentVoucherDetail({
              id: record.id,
              field: "supplier_id",
              value: newVal,
            }))
            if (supplier?.outstanding_account_id) {
              dispatch(updatePaymentVoucherDetail({
                id: record.id,
                field: "account_id",
                value: {
                  value: supplier.outstanding_account_id,
                  label: supplier.outstanding_account_name,
                },
              }));
            }
          }}
        />
      ),
    },
    {
      title: "Account",
      dataIndex: "account_id",
      key: "account_id",
      render: (val, record) => {
        return (
          <AsyncSelect
            key={record.id}
            endpoint="/accounts?only_leaf=1"
            valueKey="account_id"
            labelKey="name"
            value={record?.account_id}
            onChange={(newVal) => {
              if (!newVal) {
                dispatch(updatePaymentVoucherDetail({
                  id: record.id,
                  field: "account_id",
                  value: null,
                }));
                return;
              }
              dispatch(updatePaymentVoucherDetail({
                id: record.id,
                field: "account_id",
                value: newVal,
              }));
            }}
            style={{ width: "100%" }}
            disabled={!!record.supplier_id}
          />
        );
      },
      width: 200,
    },
    {
      title: "Transaction Date",
      dataIndex: "ledger_date",
      key: "ledger_date",
      width: 180,
      render: (val, record) => (
        <DatePicker
          value={val ? dayjs(val) : null}
          format="MM-DD-YYYY"
          onChange={(date) => {
            dispatch(updatePaymentVoucherDetail({
              id: record.id,
              field: "ledger_date",
              value: date ? date.format("YYYY-MM-DD") : null,
            }));
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Transaction No",
      dataIndex: "cheque_no",
      key: "cheque_no",
      width: 150,
      render: (val, record) => (
        <DebounceInput
          value={val}
          onChange={(newVal) =>
            dispatch(updatePaymentVoucherDetail({
              id: record.id,
              field: "cheque_no",
              value: newVal,
            }))
          }
        />
      ),
    },
    {
      title: "Cost Center",
      dataIndex: "cost_center_id",
      key: "cost_center_id",
      width: 150,
      render: (val, record) => (
        <AsyncSelectProduct
          endpoint="/cost-center"
          size="medium"
          className="w-full font-normal"
          valueKey="cost_center_id"
          labelKey="name"
          value={val}
          allowClear
          onChange={(newVal) => {
            dispatch(updatePaymentVoucherDetail({
              id: record.id,
              field: "cost_center_id",
              value: newVal,
            }))
          }}
        />
      ),
    },
    {
      title: "Event",
      dataIndex: "event_id",
      key: "event_id",
      width: 150,
      render: (value, record) => (
        <AsyncSelectProduct
          endpoint="/event"
          size="medium"
          className="w-full font-normal"
          valueKey="event_id"
          labelKey="event_name"
          value={value}
          allowClear
          onChange={(newVal) => {
            dispatch(updatePaymentVoucherDetail({
              id: record?.id,
              field: "event_id",
              value: newVal,
            }))
          }}
        />
      ),
    },
    {
      title: "Pay Amount",
      dataIndex: "payment_amount",
      key: "payment_amount",
      width: 150,
      render: (_, record) => (
        <DebouncedCommaSeparatedInput
          value={record.payment_amount}
          className="text-right"
          onChange={(val) => {
            const rawValue = String(val ?? "0");
            const clean = parseFloat(rawValue.replace(/,/g, "")) || 0;

            dispatch(updatePaymentVoucherDetail({
              id: record.id,
              field: "payment_amount",
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
          onClick={() => dispatch(addPaymentVoucherDetail())}
        />
      ),
      key: 'action',
      render: (record, { id, editable }, index) => {
        // if (record.isDeleted) {
        //   return null;
        // }
        return (
          <Dropdown
            trigger={['click']}
            // disabled={isDisable}
            arrow
            menu={{
              items: [
                {
                  key: '1',
                  label: 'Add',
                  onClick: () => dispatch(addPaymentVoucherDetail(index))
                },
                {
                  key: '2',
                  label: 'Copy',
                  onClick: () => dispatch(copyPaymentVoucherDetail(index))
                },
                {
                  key: '3',
                  label: 'Delete',
                  danger: true,
                  onClick: () => dispatch(removePaymentVoucherDetail(id)),
                  disabled: editable === false
                }
              ]
            }}>
            <Button size="small">
              <BsThreeDotsVertical />
            </Button>
          </Dropdown>
        );
      },
      width: 50,
      fixed: 'right',
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
          <span className="text-gray-500">Payment Voucher No:</span>
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
          <Col span={8}>
            <Form.Item label="Document No">
              <Input disabled value={mode === "edit" ? initialFormValues?.document_identity : "AUTO"} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="document_date"
              label="Document Date"
              rules={[{ required: true, message: "Date is required" }]}
            >
              <DatePicker format="MM-DD-YYYY" className="w-full" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="transaction_account_id"
              label="Transaction Account"
              rules={[{ required: true, message: "Transaction Account is required" }]}
            >
              <AsyncSelectProduct
                endpoint="/setting?field=transaction_account"
                size="medium"
                className="w-full font-normal"
                valueKey="account_id"
                labelKey="name"
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="remarks" label="Remarks">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={paymentVoucherDetails}
          rowClassName={(record) => (record.isDeleted ? 'hidden-row' : '')}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 'calc(100% - 200px)' }}
        />

        <Row justify="end" gutter={12} className="mt-4">
          <Col span={6}>
            <Form.Item labelCol={{ style: { fontWeight: 'bold' } }} label="Total Amount">
              <Input className='text-right' disabled value={totalSettled} />
            </Form.Item>
          </Col>
        </Row>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Link to="/general-ledger/transactions/payment-voucher">
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

export default PaymentVoucherForm;