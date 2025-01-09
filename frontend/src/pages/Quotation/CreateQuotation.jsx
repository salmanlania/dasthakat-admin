import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import QuotationForm from '../../components/Form/QuotationForm';
import PageHeading from '../../components/heading/PageHeading';
import useError from '../../hooks/useError';
import { createQuotation } from '../../store/features/quotationSlice';

const CreateQuotation = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onQuotationCreate = async (data) => {
    try {
      await dispatch(createQuotation(data)).unwrap();
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
        <QuotationForm onSubmit={onQuotationCreate} />
      </div>
    </>
  );
};

export default CreateQuotation;
