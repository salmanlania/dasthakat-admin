import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SaleReturnForm from '../../components/Form/SaleReturnForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
// import { getSaleInvoice, updateSaleInvoiceForm } from '../../store/features/saleInvoiceSlice';
import { getSaleReturn } from '../../store/features/saleReturnSlice';

const EditPurchaseReturn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.saleReturn);

  // const onSaleInvoiceUpdate = async (data) => {
  //   try {
  //     await dispatch(updateSaleInvoiceForm({ id, data })).unwrap();
  //     toast.success('Sale invoice updated successfully');
  //     dispatch(getSaleReturn(id)).unwrap()
  //   } catch (error) {
  //     handleError(error);
  //   }
  // };

  // const onSaleInvoiceUpdates = async (data) => {
  //   try {
  //     await dispatch(updateSaleInvoiceForm({ id, data })).unwrap();
  //     toast.success('Sale invoice updated successfully');
  //     navigate('/sale-invoice');
  //   } catch (error) {
  //     handleError(error);
  //   }
  // };

  useEffect(() => {
    dispatch(getSaleReturn(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT SALE RETURN</PageHeading>
        <Breadcrumb items={[{ title: 'Sale Return' }, { title: 'Edit' }]} separator=">" />
      </div>
      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        {/* <SaleReturnForm mode="edit" onSubmit={onSaleInvoiceUpdate} onSave={onSaleInvoiceUpdates} /> */}
        <SaleReturnForm mode="edit" />
      </div>
    </>
  );
};

export default EditPurchaseReturn;
