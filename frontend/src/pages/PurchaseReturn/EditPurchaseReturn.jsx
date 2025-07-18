import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PurchaseReturnForm from '../../components/Form/PurchaseReturnForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { getPurchaseReturn, updatePurchaseReturn } from '../../store/features/purchaseReturnSlice';

const EditPurchaseReturn = () => {
  useDocumentTitle('Edit Purchase Return');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.purchaseReturn);

  const PurchaseReturnUpdate = async (data) => {
    try {
      await dispatch(updatePurchaseReturn({ id, data })).unwrap();
      toast.success('Purchase Return updated successfully');
      dispatch(getPurchaseReturn(id)).unwrap().catch(handleError);
    } catch (error) {
      handleError(error);
    }
  };
  const PurchaseReturnUpdates = async (data) => {
    try {
      await dispatch(updatePurchaseReturn({ id, data })).unwrap();
      toast.success('Purchase Return updated successfully');
      navigate('/purchase-return');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getPurchaseReturn(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT PURCHASE RETURN</PageHeading>
        <Breadcrumb items={[{ title: 'Purchase Return' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <PurchaseReturnForm
            mode="edit"
            onSubmit={PurchaseReturnUpdate}
            onSave={PurchaseReturnUpdates}
          />
        </div>
      ) : null}
    </>
  );
};

export default EditPurchaseReturn;
