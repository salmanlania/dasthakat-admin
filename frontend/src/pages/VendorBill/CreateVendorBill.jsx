import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createVendorBill, resetVendorBillForm } from '../../store/features/vendorBillSlice';
import { useEffect } from 'react';
import VendorBillForm from '../../components/Form/VendorBillForm';

const CreateVendorBill = () => {
  useDocumentTitle('Create Vendor Bill');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onVendorBillCreate = async (data) => {
    try {
      const res = await dispatch(createVendorBill(data)).unwrap();
      const createdId = res?.data?.vendor_bill_id;
      toast.success('Vendor Bill created successfully');
      navigate(`/general-ledger/transactions/vendor-bill/edit/${createdId}`);
    } catch (error) {
      handleError(error);
    }
  };
  const onVendorBillCreates = async (data) => {
    try {
      await dispatch(createVendorBill(data)).unwrap();
      toast.success('Vendor Bill created successfully');
      navigate('/general-ledger/transactions/vendor-bill');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(resetVendorBillForm());
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE VENDOR BILL</PageHeading>
        <Breadcrumb items={[{ title: 'Vendor Bill' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <VendorBillForm onSubmit={onVendorBillCreate} onSave={onVendorBillCreates} />
      </div>
    </>
  );
};

export default CreateVendorBill;
