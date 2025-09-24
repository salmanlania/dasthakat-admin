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
import { addPaymentVoucherDetail, changePaymentVoucherDetailOrder, copyPaymentVoucherDetail, removePaymentVoucherDetail, updatePaymentVoucherDetail } from '../../store/features/paymentVoucherSlice';
import AsyncSelect from '../AsyncSelect';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';
import AsyncSelectProduct from '../AsyncSelectProduct';

const PaymentVoucherForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, paymentVoucherDetails } = useSelector(
    (state) => state.paymentVoucher
  );

  const [submitAction, setSubmitAction] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [settledAmounts, setSettledAmounts] = useState({});
  const [totalSettled, setTotalSettled] = useState(0);

  const onFinish = (values) => {
    const data = {
      ...values,
      transaction_account_id: values?.transaction_account_id ? values?.transaction_account_id?.value || values?.transaction_account_id : null,
      total_amount: totalSettled,
      net_amount: totalSettled + 100,
      document_date: values?.document_date ? dayjs(values.document_date).format("YYYY-MM-DD") : null,
      details: paymentVoucherDetails.map((row, index) => ({
        ...row,
        sort_order: index + 1,
        account_id: row?.account_id ? row?.account_id?.value || row?.account_id : null,
      }))
    };
    submitAction === 'save'
      ? onSubmit(data)
      : submitAction === 'saveAndExit'
        ? onSave(data)
        : null;
  };

  const handleSettledAmountChange = (value, record) => {
    const rawValue = typeof value === "string" ? value : String(value ?? "0");
    const settledAmount = parseFloat(rawValue.replace(/,/g, "")) || 0;
    if (settledAmount < 0) {
      toast.error("Amount cannot be negative");
      return;
    }
    setSettledAmounts(prev => ({ ...prev, [record.id]: settledAmount }));
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
              // disabled={index === chargeOrderDetails.length - 1 }
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
      title: "Account",
      dataIndex: "account_id",
      key: "account_id",
      render: (val, record) => {
        return (
          <AsyncSelect
            endpoint="/accounts?only_leaf=1"
            valueKey="account_id"
            labelKey="name"
            value={record?.account_id}
            // value={val} // show current value
            onChange={(newVal) => {
              // return
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
          />
        );
      },
      width: 150,
    },
    {
      title: "Cheque Date",
      dataIndex: "cheque_date",
      key: "cheque_date",
      render: (val, record) => (
        <DatePicker
          value={val ? dayjs(val) : null}
          format="MM-DD-YYYY"
          onChange={(date) => {
            dispatch(updatePaymentVoucherDetail({
              id: record.id,
              field: "cheque_date",
              value: date ? date.format("YYYY-MM-DD") : null,
            }));
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Cheque No",
      dataIndex: "cheque_no",
      key: "cheque_no",
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
      title: "Pay Amount",
      dataIndex: "payment_amount",
      key: "payment_amount",
      render: (_, record) => (
        <DebouncedCommaSeparatedInput
          value={record.payment_amount}
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
    // {
    //   title: "Net Amount",
    //   dataIndex: "net_amount",
    //   key: "net_amount",
    //   render: (val) => <DebouncedCommaSeparatedInput value={val} />
    // },
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
      // render: (record, { id, editable }, index) => {
      //   return (
      //     <Dropdown
      //       trigger={['click']}
      //       // disabled={isDisable}
      //       arrow
      //       menu={{
      //         items: [
      //           {
      //             key: '1',
      //             label: 'Add',
      //             onClick: () => dispatch(addPaymentVoucherDetail(index))
      //           },
      //           {
      //             key: '2',
      //             label: 'Copy',
      //             onClick: () => dispatch(copyPaymentVoucherDetail(index))
      //           },
      //           {
      //             key: '3',
      //             label: 'Delete',
      //             danger: true,
      //             onClick: () => dispatch(removePaymentVoucherDetail(id)),
      //             disabled: editable === false
      //           }
      //         ]
      //       }}>
      //       <Button size="small">
      //         <BsThreeDotsVertical />
      //       </Button>
      //     </Dropdown>
      //   );
      // },
      width: 50,
      fixed: 'right'
    }
  ];

  return (
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
            <Input disabled value={mode === "edit" ? initialFormValues?.document_no : "AUTO"} />
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
          // rules={[{ required: true, message: "Transaction Account is required" }]}
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
        rowKey="id"
        pagination={false}
        size="small"
      // virtual
      // scroll={{ y: 400 }}
      // rowSelection={{
      //   columnWidth: 40,
      //   selectedRowKeys,
      //   onChange: (newKeys, newRows) => {
      //     setSelectedRowKeys(newKeys);
      //     setSelectedRows(newRows);
      //   }
      // }}
      />

      <Row justify="end" gutter={12} className="mt-4">
        <Col span={6}>
          <Form.Item label="Total Amount">
            <Input disabled value={totalSettled} />
          </Form.Item>
        </Col>
      </Row>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/general-ledger/transactions/payment-voucher">
          <Button className="w-28">Cancel</Button>
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
      </div>
    </Form>
  );
};

export default PaymentVoucherForm;