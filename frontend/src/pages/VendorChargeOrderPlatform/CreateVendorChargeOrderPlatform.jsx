import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import QuotationForm from '../../components/Form/QuotationForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { createQuotation , getQuotation} from '../../store/features/quotationSlice';

const CreateVendorChargeOrderPlatform = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.quotation;

  const onQuotationCreate = async (data) => {
    try {
      const res = await dispatch(createQuotation(data)).unwrap();
      const createdId = res.data.data.quotation_id;
      toast.success('Quotation created successfully');
      navigate(`/quotation/edit/${createdId}`);
    } catch (error) {
      handleError(error);
    }
  };
  const onQuotationCreates = async (data) => {
    try {
      const res = await dispatch(createQuotation(data)).unwrap();
      const createdId = res.data.data.quotation_id;
      toast.success('Quotation created successfully');
      navigate('/quotation');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE QUOTATION</PageHeading>
        <Breadcrumb items={[{ title: 'Quotation' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <QuotationForm onSubmit={onQuotationCreate} onSave={onQuotationCreates} />
      </div>
    </>
  );
};

export default CreateVendorChargeOrderPlatform;
