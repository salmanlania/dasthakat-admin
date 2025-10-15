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
import { addJournalVoucherDetail, changeJournalVoucherDetailOrder, updateJournalVoucherDetail, removeJournalVoucherDetail, copyJournalVoucherDetail } from '../../store/features/journalVoucherSlice';
import AsyncSelect from '../AsyncSelect';
import AsyncSelectPaymentVoucher from '../AsyncSelectPaymentVoucher';
import AsyncSelectProduct from '../AsyncSelectProduct';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';
import LedgerModal from '../Modals/LedgerModal';

const JournalVoucherForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, journalVoucherDetails } = useSelector(
    (state) => state.journalVoucher
  );

  const { user } = useSelector((state) => state.auth);
  const permissions = user?.permission;

  const [submitAction, setSubmitAction] = useState(null);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);

  const onFinish = (values) => {
    const checkBothCreditDebit = totalDebit === totalCredit
    if (!checkBothCreditDebit) {
      toast.error('Both total debit and credit must be same')
      return
    }

    const data = {
      ...initialFormValues,
      ...values,
      total_debit: totalDebit,
      total_credit: totalCredit,
      document_date: values?.document_date ? dayjs(values?.document_date).format("YYYY-MM-DD") : null,
      details: journalVoucherDetails.map((row, index) => ({
        ...row,
        sort_order: index + 1,
        account_id: row?.account_id ? row?.account_id?.value || row?.account_id : null,
        debit: row?.debit ? row?.debit : 0,
        credit: row?.credit ? row?.credit : 0,
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
          onClick={() => dispatch(addJournalVoucherDetail())}

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
                dispatch(changeJournalVoucherDetailOrder({ from: index, to: index - 1 }));
              }}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
              onClick={() => {
                dispatch(changeJournalVoucherDetailOrder({ from: index, to: index + 1 }));
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
            key={record.id}
            endpoint="/accounts?only_leaf=1"
            params={{ searchKey: 'name' }}
            valueKey="account_id"
            labelKey="name"
            value={record?.account_id}
            onChange={(newVal) => {
              if (!newVal) {
                dispatch(updateJournalVoucherDetail({
                  id: record.id,
                  field: "account_id",
                  value: null,
                }));
                return;
              }
              dispatch(updateJournalVoucherDetail({
                id: record.id,
                field: "account_id",
                value: newVal,
              }));
            }}
            style={{ width: "100%" }}
          />
        );
      },
      width: 200,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      width: 150,
      render: (val, record) => (
        <DebounceInput
          value={val}
          onChange={(newVal) =>
            dispatch(updateJournalVoucherDetail({
              id: record.id,
              field: "remarks",
              value: newVal,
            }))
          }
        />
      ),
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      width: 150,
      render: (_, record) => (
        <DebouncedCommaSeparatedInput
          value={record.debit}
          className="text-right"
          disabled={!!record.credit && record.credit > 0}
          onChange={(val) => {
            const rawValue = String(val ?? "0");
            const clean = parseFloat(rawValue.replace(/,/g, "")) || 0;

            dispatch(updateJournalVoucherDetail({
              id: record.id,
              field: "debit",
              value: clean,
            }));

            if (clean > 0 && record.credit > 0) {
              dispatch(updateJournalVoucherDetail({
                id: record.id,
                field: "credit",
                value: 0,
              }));
            }
          }}
        />
      ),
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      width: 150,
      render: (_, record) => (
        <DebouncedCommaSeparatedInput
          value={record.credit}
          className="text-right"
          disabled={!!record.debit && record.debit > 0}
          onChange={(val) => {
            const rawValue = String(val ?? "0");
            const clean = parseFloat(rawValue.replace(/,/g, "")) || 0;

            dispatch(updateJournalVoucherDetail({
              id: record.id,
              field: "credit",
              value: clean,
            }));
            if (clean > 0 && record.debit > 0) {
              dispatch(updateJournalVoucherDetail({
                id: record.id,
                field: "debit",
                value: 0,
              }));
            }
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
          onClick={() => dispatch(addJournalVoucherDetail())}
        />
      ),
      key: 'action',
      render: (record, { id, editable }, index) => {

        return (
          <Dropdown
            trigger={['click']}
            arrow
            menu={{
              items: [
                {
                  key: '1',
                  label: 'Add',
                  onClick: () => dispatch(addJournalVoucherDetail(index))
                },
                {
                  key: '2',
                  label: 'Copy',
                  onClick: () => dispatch(copyJournalVoucherDetail(index))
                },
                {
                  key: '3',
                  label: 'Delete',
                  danger: true,
                  onClick: () => dispatch(removeJournalVoucherDetail(id)),
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

  useEffect(() => {
    if (journalVoucherDetails && journalVoucherDetails.length > 0) {
      const debitSum = journalVoucherDetails.reduce((acc, curr) => {
        if (curr.row_status === 'D') return acc;
        const val = parseFloat(curr.debit || 0);
        return acc + (isNaN(val) ? 0 : val);
      }, 0);

      const creditSum = journalVoucherDetails.reduce((acc, curr) => {
        if (curr.row_status === 'D') return acc;
        const val = parseFloat(curr.credit || 0);
        return acc + (isNaN(val) ? 0 : val);
      }, 0);

      setTotalDebit(debitSum);
      setTotalCredit(creditSum);
    } else {
      setTotalDebit(0);
      setTotalCredit(0);
    }
  }, [journalVoucherDetails]);

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
          <span className="text-gray-500">Journal Voucher No:</span>
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
          dataSource={journalVoucherDetails}
          rowClassName={(record) => (record.isDeleted ? 'hidden-row' : '')}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 'calc(100% - 200px)' }}
          summary={() => {
            if (!journalVoucherDetails?.length) {
              return null;
            }
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}><strong>Total</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={1} />
                  <Table.Summary.Cell index={2} />
                  <Table.Summary.Cell index={3} align="right" style={{ textAlign: 'right', fontWeight: 'bold' }}><strong>{totalDebit}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="right" style={{ textAlign: 'right', fontWeight: 'bold' }}><strong>{totalCredit}</strong></Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />

        {/* <Row justify="end" gutter={12} className="mt-4">
          <Col span={6}>
            <Form.Item labelCol={{ style: { fontWeight: 'bold' } }} label="Total Amount">
              <Input className='text-right' disabled value={totalDebit} />
            </Form.Item>
          </Col>
        </Row> */}

        <div className="mt-4 flex items-center justify-end gap-2">
          <Link to="/general-ledger/transactions/journal-voucher">
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

export default JournalVoucherForm;