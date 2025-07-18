import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CurrencyForm from '../../components/Form/CurrencyForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createCurrency } from '../../store/features/currencySlice';

const CreateCurrency = () => {
  useDocumentTitle('Create Currency');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onCurrencyCreate = async (data) => {
    try {
      await dispatch(createCurrency(data)).unwrap();
      toast.success('Currency created successfully');
      navigate('/currency');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE CURRENCY</PageHeading>
        <Breadcrumb items={[{ title: 'Currency' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <CurrencyForm onSubmit={onCurrencyCreate} />
      </div>
    </>
  );
};

export default CreateCurrency;
