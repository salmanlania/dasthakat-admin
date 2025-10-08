import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import VendorBillForm from '../../components/Form/VendorBillForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { getVendorBill, updateVendorBillForm } from '../../store/features/vendorBillSlice';

const EditVendorBill = () => {
  useDocumentTitle('Edit Vendor Bill');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.vendorBill);

  const onVendorBillUpdate = async (data) => {
    try {
      await dispatch(updateVendorBillForm({ id, data })).unwrap();
      toast.success('Vendor Bill updated successfully');
      dispatch(getVendorBill(id)).unwrap()
    } catch (error) {
      handleError(error);
    }
  };

  const onVendorBillUpdates = async (data) => {
    try {
      await dispatch(updateVendorBillForm({ id, data })).unwrap();
      toast.success('Vendor Bill updated successfully');
      navigate('/general-ledger/transactions/vendor-bill');
    } catch (error) {
      handleError(error);
    }
  };

  const onVendorBillUpdateVendor = async (data) => {
    try {
      const res = await dispatch(updateVendorBillForm({ id, data })).unwrap();
      return res;
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(getVendorBill(id)).unwrap();
    } catch (error) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT VENDOR BILL</PageHeading>
        <Breadcrumb items={[{ title: 'Vendor Bill' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <VendorBillForm mode="edit" onSubmit={onVendorBillUpdate} onSave={onVendorBillUpdates} onVendor={onVendorBillUpdateVendor} />
        </div>
      ) : null}
    </>
  );
};

export default EditVendorBill;
