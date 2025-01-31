import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PurchaseInvoiceForm from '../../components/Form/PurchaseInvoiceForm';
import PageHeading from '../../components/heading/PageHeading';
import useError from '../../hooks/useError';
import { createPurchaseInvoice } from '../../store/features/purchaseInvoiceSlice';

const CreatePurchaseInvoice = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onPurchaseInvoiceCreate = async (data) => {
    try {
      // await dispatch(createPurchaseInvoice(data)).unwrap();
      // toast.success('Purchase invoice created successfully');
      navigate('/purchase-invoice');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE PURCHASE INVOICE</PageHeading>
        <Breadcrumb items={[{ title: 'Purchase Invoice' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <PurchaseInvoiceForm onSubmit={onPurchaseInvoiceCreate} />
      </div>
    </>
  );
};

export default CreatePurchaseInvoice;
