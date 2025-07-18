import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PurchaseOrderForm from '../../components/Form/PurchaseOrderForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { getPurchaseOrder, updatePurchaseOrder } from '../../store/features/purchaseOrderSlice';

const EditPurchaseOrder = () => {
  useDocumentTitle('Edit Purchase Order');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.purchaseOrder);

  const onPurchaseOrderUpdate = async (data) => {
    try {
      const res = await dispatch(updatePurchaseOrder({ id, data })).unwrap();
      toast.success('Purchase order updated successfully');
      await dispatch(getPurchaseOrder(id)).unwrap().catch(handleError);
    } catch (error) {
      handleError(error);
    }
  };

  const onPurchaseOrderUpdates = async (data) => {
    try {
      await dispatch(updatePurchaseOrder({ id, data })).unwrap();
      toast.success('Purchase order updated successfully');
      navigate('/purchase-order');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getPurchaseOrder(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT PURCHASE ORDER</PageHeading>
        <Breadcrumb items={[{ title: 'Purchase Order' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <PurchaseOrderForm
            mode="edit"
            onSubmit={onPurchaseOrderUpdate}
            onSave={onPurchaseOrderUpdates}
          />
        </div>
      ) : null}
    </>
  );
};

export default EditPurchaseOrder;
