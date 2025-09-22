import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VendorPaymentForm from '../../components/Form/VendorPaymentForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createQuotation } from '../../store/features/quotationSlice';

const CreateVendorPayment = () => {
  useDocumentTitle('Create Vendor Payment');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.quotation;

  const onQuotationCreate = async (data) => {
    try {
      const res = await dispatch(createQuotation(data)).unwrap();
      const createdId = res.data.data.quotation_id;
      toast.success('Vendor Payment created successfully');
      navigate(`/general-ledger/transactions/vendor-payment/edit/${createdId}`);
    } catch (error) {
      handleError(error);
    }
  };
  const onQuotationCreates = async (data) => {
    try {
      const res = await dispatch(createQuotation(data)).unwrap();
      const createdId = res.data.data.quotation_id;
      toast.success('Vendor Payment created successfully');
      navigate('/general-ledger/transactions/vendor-payment');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE VENDOR PAYMENT</PageHeading>
        <Breadcrumb items={[{ title: 'Vendor Payment' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <VendorPaymentForm onSubmit={onQuotationCreate} onSave={onQuotationCreates} />
      </div>
    </>
  );
};

export default CreateVendorPayment;
