import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PurchaseInvoiceForm from '../../components/Form/PurchaseInvoiceForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import {
  getPurchaseInvoice,
  updatePurchaseInvoice
} from '../../store/features/purchaseInvoiceSlice';

const EditPurchaseInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.purchaseInvoice);

  const onPurchaseInvoiceUpdate = async (data) => {
    try {
      await dispatch(updatePurchaseInvoice({ id, data })).unwrap();
      toast.success('Purchase invoice updated successfully');
      navigate('/purchase-invoice');
    } catch (error) {
      handleError(error);
      console.log('error' , error)
    }
  };

  useEffect(() => {
    dispatch(getPurchaseInvoice(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT PURCHASE INVOICE</PageHeading>
        <Breadcrumb items={[{ title: 'Purchase Invoice' }, { title: 'Edit' }]} separator=">" />
      </div>
      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <PurchaseInvoiceForm mode="edit" onSubmit={onPurchaseInvoiceUpdate} />
      </div>
    </>
  );
};

export default EditPurchaseInvoice;
