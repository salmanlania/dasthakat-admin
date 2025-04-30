import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SaleInvoiceForm from '../../components/Form/SaleInvoiceForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { createPurchaseInvoice } from '../../store/features/purchaseInvoiceSlice';

const CreateSaleInvoice = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onSaleInvoiceCreate = async (data) => {
    try {
      // await dispatch(createPurchaseInvoice(data)).unwrap();
      // toast.success('Purchase invoice created successfully');
      navigate('/sale-invoice');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE SALE INVOICE</PageHeading>
        <Breadcrumb items={[{ title: 'Sale Invoice' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <SaleInvoiceForm onSubmit={onSaleInvoiceCreate} />
      </div>
    </>
  );
};

export default CreateSaleInvoice;
