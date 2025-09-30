/* eslint-disable react/prop-types */
import { Button, Col, Form, Modal, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import AsyncSelect from "../AsyncSelect";
import DebounceInput from "../Input/DebounceInput";
import DebouncedCommaSeparatedInput from "../Input/DebouncedCommaSeparatedInput";

import {
  changeVendorSettlementDetail,
  clearVendorSettlementDetails,
  createPaymentVoucherSettlement,
  getUnsettledInvoices,
  updateVendorSettlementDetail
} from "../../store/features/paymentVoucherSlice";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import useError from "../../hooks/useError";
import DebouncedCommaSeparatedInputRate from "../Input/DebouncedCommaSeparatedInputRate";

const VendorSettlementTaggingModal = ({ open, onClose, paymentVoucherId }) => {
  const DetailSummaryInfoVendor = ({ value, disabled }) => {
    console.log('value', value)
    return (
      <div className="grid grid-cols-2 items-center gap-4 mb-2">
        <DebouncedCommaSeparatedInputRate
          disabled={disabled}
          className="text-sm font-semibold text-black text-right"
          value={value}
          onChange={() => { }}
        />
      </div>
    );
  };
  const handleError = useError
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { vendorPaymentSettlementDetails, isLedgerLoading } = useSelector((state) => state.paymentVoucher);

  useEffect(() => {
    const total = vendorPaymentSettlementDetails.reduce(
      (sum, row) => sum + (parseFloat(row.settle_amount) || 0),
      0
    );
    console.log('total', total)
    console.log('totalAmount', totalAmount)
    setTotalAmount(total);
  }, [vendorPaymentSettlementDetails]);

  const handleOk = async () => {
    if (selectedRowKeys.length === 0) {
      toast.error("Please select at least one record");
      return;
    }
    const selectedRows = vendorPaymentSettlementDetails.filter(row => selectedRowKeys.includes(row.id));
    const check = selectedRows.some(row => row?.settle_amount > row?.amount);
    if (check) {
      toast.error("Settle amount must be equal to or less than amount");
      return;
    }
    const values = await form.getFieldsValue();
    const supplierId = values.supplier_id?.value;
    const data = {
      supplier_id: supplierId,
      document_date: dayjs().format('YYYY-MM-DD'),
      payment_voucher_id: paymentVoucherId,
      total_amount: selectedRows.reduce((sum, row) => sum + (parseFloat(row.settle_amount) || 0), 0),
      details: selectedRows.map((row, index) => ({
        ...row,
      }))
    }
    console.log('data', data)
    // return
    try {
      dispatch(createPaymentVoucherSettlement(data));
      // onClose();
    } catch (err) {
      handleError(err);
      // validation errors
    }
  };

  const handleClose = () => {
    dispatch(clearVendorSettlementDetails());
    onClose();
  };

  const columns = [
    {
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
                dispatch(changeVendorSettlementDetail({ from: index, to: index - 1 }));
              }}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
              onClick={() => {
                dispatch(changeVendorSettlementDetail({ from: index, to: index + 1 }));
              }}
            />
          </div>
        );
      },
      width: 50,
      fixed: 'left'
    },
    {
      title: "Document Identity",
      dataIndex: "document_identity",
      key: "document_identity",
      render: (val, record) => {
        return (
          <DebounceInput
            value={val}
            disabled={record?.disabled || record?.purchase_invoice_id || record?.purchase_invoice_id === ""}
            onChange={(newVal) =>
              dispatch(updateVendorSettlementDetail({
                id: record.id,
                field: "document_identity",
                value: newVal,
              }))
            }
          />
        );
      },
      width: 230,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      render: (_, record) => (
        <DebouncedCommaSeparatedInput
          className="text-right"
          value={record.amount}
          disabled={record?.disabled || record?.purchase_invoice_id || record?.purchase_invoice_id === ""}
          onChange={(val) => {
            const rawValue = String(val ?? "0");
            const clean = parseFloat(rawValue.replace(/,/g, "")) || 0;

            dispatch(updateVendorSettlementDetail({
              id: record.id,
              field: "amount",
              value: clean,
            }));
          }}
        />
      ),
    },
    {
      title: "Settle Amount",
      dataIndex: "settle_amount",
      key: "settle_amount",
      width: 150,
      render: (_, record) => (
        <DebouncedCommaSeparatedInput
          className="text-right"
          value={record.settle_amount}
          onChange={(val) => {
            const rawValue = String(val ?? "0");
            const clean = parseFloat(rawValue.replace(/,/g, "")) || 0;

            dispatch(updateVendorSettlementDetail({
              id: record.id,
              field: "settle_amount",
              value: clean,
            }));
          }}
        />
      ),
    },
  ];

  return (
    <Modal
      open={open}
      title="Select Vendor"
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button key="ok" type="primary" onClick={handleOk}>
          Save
        </Button>,
      ]}
      width={1500}
      destroyOnClose
      centered
    >
      <Row gutter={12} style={{alignItems: 'center'}}>
        <Col span={24} sm={6} md={6} lg={6}>
          <Form layout="vertical" form={form}>
            <Form.Item
              name="supplier_id"
              label="Vendor"
              rules={[{ required: true, message: "Vendor is required" }]}
            >
              <AsyncSelect
                endpoint="/supplier"
                valueKey="supplier_id"
                labelKey="name"
                labelInValue
                placeholder="Select Vendor"
                style={{ width: "100%" }}
                onChange={(value) => {
                  console.log('value', value);
                  const supplierId = value ? value?.value : null;
                  dispatch(getUnsettledInvoices({ supplierId, paymentVoucherId }));
                }}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col span={24} sm={6} md={6} lg={6}>
          {/* <Form.Item
            name="total_amount"
            label="Total Amount"
          >
            <DetailSummaryInfoVendor
              disabled
              value={totalAmount || "0.00"}
            />
          </Form.Item> */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Total Amount
            </label>
            <DetailSummaryInfoVendor disabled value={totalAmount || "0.00"} />
          </div>
        </Col>

      </Row>

      <Row>
        <Table
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
          }}
          columns={columns}
          dataSource={vendorPaymentSettlementDetails}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 'calc(100% - 200px)' }}
        />
      </Row>
    </Modal>
  );
};

export default VendorSettlementTaggingModal;