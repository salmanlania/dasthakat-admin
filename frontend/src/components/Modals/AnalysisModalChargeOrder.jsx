import { Button, Form, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineX } from 'react-icons/hi';
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useError from '../../hooks/useError';
import {
  createChargeOrder,
  temporaryServiceOrder,
  chargeOrderAnalysis,
  setTempChargeOrderID,
  setAnalysisChargeOrderID
} from '../../store/features/chargeOrderSlice';
import { changeQuotationDetailValue, getQuotation } from '../../store/features/quotationSlice';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';

const AnalysisModalChargeOrder = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const {
    tempChargeOrderID,
    tempChargeDetails,
    isTempDataLoading,
    analysisChargeOrderID,
    analysisChargeDetails,
    isAnalysisLoading,
    initialFormValues
  } = useSelector((state) => state.chargeOrder);
  const { user } = useSelector((state) => state.auth);
  const newAnalysisChargeDetails = analysisChargeDetails.charge_order_detail 
  console.log('analysisChargeDetails', newAnalysisChargeDetails);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const closeModal = () => {
    dispatch(setAnalysisChargeOrderID(null));
    setSelectedRowKeys([]);
  };

  const columns = [
    {
      title: 'Product Code',
      dataIndex: 'product_code',
      key: 'product_code',
      width: 100,
      render: (_, { product_code }) => product_code || ''
    },
    {
      title: 'Product Description',
      dataIndex: 'product_description',
      key: 'product_description',
      width: 240,
      ellipsis: true,
    },
    {
      title: 'Actual Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100
    },
    {
      title: 'Picked Quantity',
      dataIndex: 'picked_quantity',
      key: 'picked_quantity',
      width: 100
    },
    {
      title: 'Shipped Quantity',
      dataIndex: 'shipped_quantity',
      key: 'shipped_quantity',
      width: 100
    },
    {
      title: 'Invoiced Quantity',
      dataIndex: 'invoiced_quantity',
      key: 'invoiced_quantity',
      width: 100
    },
  ];

  useEffect(() => {
    if (analysisChargeOrderID) {
      dispatch(chargeOrderAnalysis({ charge_order_id: analysisChargeOrderID }))
        .unwrap()
        .catch(handleError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisChargeOrderID])

  return (
    <Modal open={analysisChargeOrderID !== null} footer={null} onCancel={closeModal} width={840} closeIcon={<HiOutlineX className="text-gray-600 text-2xl" />}>
      <div className="mb-3 flex items-center justify-between text-gray-600">
        <p className="text-base font-medium">Product Status.</p>
      </div>

      <Form name="analysis-charge-order-modal" form={form}>
        <Table
          columns={columns}
            dataSource={newAnalysisChargeDetails}
          rowKey="charge_order_detail_id"
          pagination={false}
          size="small"
          loading={isAnalysisLoading}
          scroll={{ x: 'calc(100% - 200px)', y: 600 }}
        />

        
      </Form>
    </Modal>
  );
};

export default AnalysisModalChargeOrder;
