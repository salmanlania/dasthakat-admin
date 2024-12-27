import { Button, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { HiRefresh } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useError from "../../hooks/useError";
import {
  setChargeOrderDetails,
  setChargeOrderFormValues,
  setChargeQuotationID,
} from "../../store/features/chargeOrderSlice";
import {
  changeQuotationDetailValue,
  getQuotation,
} from "../../store/features/quotationSlice";
import DebouncedCommaSeparatedInput from "../Input/DebouncedCommaSeparatedInput";

const ChargeOrderModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleError = useError();
  const { chargeQuotationID } = useSelector((state) => state.chargeOrder);
  const { isItemLoading, quotationDetails, initialFormValues } = useSelector(
    (state) => state.quotation
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const closeModal = () => {
    dispatch(setChargeQuotationID(null));
    setSelectedRowKeys([]);
  };

  const columns = [
    {
      title: "Sr.",
      dataIndex: "sr",
      key: "sr",
      width: 60,
      render: (_, __, index) => `${index + 1}.`,
    },
    {
      title: "Product Code",
      dataIndex: "product_code",
      key: "product_code",
      width: 120,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      width: 200,
      render: (_, { product_id }) => product_id.label,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 240,
      ellipsis: true,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      fixed: "right",
      render: (_, { quantity }, index) => {
        return (
          <DebouncedCommaSeparatedInput
            value={quantity}
            onChange={(value) =>
              dispatch(
                changeQuotationDetailValue({
                  index,
                  key: "quantity",
                  value: value,
                })
              )
            }
          />
        );
      },
    },
  ];

  const onCharge = () => {
    const selectedDetails = quotationDetails.filter((detail) =>
      selectedRowKeys.includes(detail.id)
    );

    const chargeOrderFormValues = {
      document_date: initialFormValues.document_date,
      salesman_id: initialFormValues.salesman_id,
      event_id: initialFormValues.event_id,
      vessel_id: initialFormValues.vessel_id,
      customer_id: initialFormValues.customer_id,
      class1_id: initialFormValues.class1_id,
      class2_id: initialFormValues.class2_id,
      flag_id: initialFormValues.flag_id,
      agent_id: initialFormValues.agent_id,
    };

    const chargeOrderDetails = selectedDetails.map((item) => ({
      id: item.id,
      product_code: item.product_code,
      product_id: item.product_id,
      description: item.description,
      quantity: item.quantity,
      unit_id: item.unit_id,
      supplier_id: item.supplier_id,
    }));

    dispatch(setChargeOrderFormValues(chargeOrderFormValues));
    dispatch(setChargeOrderDetails(chargeOrderDetails));
    closeModal();
    navigate(`/charge-order/create?quotation_id=${chargeQuotationID}`);
  };

  useEffect(() => {
    if (chargeQuotationID) {
      dispatch(getQuotation(chargeQuotationID)).unwrap().catch(handleError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chargeQuotationID]);

  return (
    <Modal open={chargeQuotationID} closable={false} footer={null} width={840}>
      <div className="mb-3 flex justify-between items-center text-gray-600">
        <p className="font-medium text-base">
          Select products to charge order.
        </p>
        {isItemLoading ? (
          <HiRefresh size={22} className="animate-spin" />
        ) : (
          <p>{initialFormValues?.document_identity}</p>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={quotationDetails}
        rowKey="id"
        pagination={false}
        size="small"
        loading={isItemLoading}
        scroll={{ x: "calc(100% - 200px)", y: 300 }}
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
      />

      <div className="flex justify-center gap-2 items-center mt-2">
        <Button className="w-40" onClick={closeModal}>
          Cancel
        </Button>
        <Button className="w-40" type="primary" onClick={onCharge}>
          Charge
        </Button>
      </div>
    </Modal>
  );
};

export default ChargeOrderModal;
