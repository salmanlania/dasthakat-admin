import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PurchaseOrderForm from '../../components/Form/PurchaseOrderForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { createPurchaseOrder } from '../../store/features/purchaseOrderSlice';

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onPurchaseOrderCreate = async (data) => {
    try {
      const res = await dispatch(createPurchaseOrder(data)).unwrap();
      toast.success('Purchase order created successfully');
      const createdId = res.purchase_order_id;
      navigate(`/purchase-order/edit/${createdId}`);
    } catch (error) {
      handleError(error);
    }
  };

  const onPurchaseOrderCreates = async (data) => {
    try {
      await dispatch(createPurchaseOrder(data)).unwrap();
      toast.success('Purchase order created successfully');
      navigate('/purchase-order');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE PURCHASE ORDER</PageHeading>
        <Breadcrumb items={[{ title: 'Purchase Order' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <PurchaseOrderForm onSubmit={onPurchaseOrderCreate} onSave={onPurchaseOrderCreates} />
      </div>
    </>
  );
};

export default CreatePurchaseOrder;
