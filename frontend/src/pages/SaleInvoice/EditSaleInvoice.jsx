import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SaleInvoiceForm from '../../components/Form/SaleInvoiceForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { getSaleInvoice, updateSaleInvoiceForm } from '../../store/features/saleInvoiceSlice';

const EditSaleInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.saleInvoice);

  const onSaleInvoiceUpdate = async (data) => {
    try {
      await dispatch(updateSaleInvoiceForm({ id, data })).unwrap();
      toast.success('Sale invoice updated successfully');
      dispatch(getSaleInvoice(id)).unwrap()
    } catch (error) {
      handleError(error);
    }
  };

  const onSaleInvoiceUpdates = async (data) => {
    try {
      await dispatch(updateSaleInvoiceForm({ id, data })).unwrap();
      toast.success('Sale invoice updated successfully');
      navigate('/sale-invoice');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    // dispatch(getSaleInvoice(id)).unwrap().catch(handleError);
    try {
      dispatch(getSaleInvoice(id)).unwrap()
    } catch (error) {
      console.log('error' , error)
      handleError()
    }
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT SALE INVOICE</PageHeading>
        <Breadcrumb items={[{ title: 'Sale Invoice' }, { title: 'Edit' }]} separator=">" />
      </div>
      
      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <SaleInvoiceForm mode="edit" onSubmit={onSaleInvoiceUpdate} onSave={onSaleInvoiceUpdates} />
      </div>
    </>
  );
};

export default EditSaleInvoice;