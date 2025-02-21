import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CurrencyForm from '../../components/Form/CurrencyForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { getCurrency, updateCurrency } from '../../store/features/currencySlice';

const EditCurrency = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.currency);

  const onCurrencyUpdate = async (data) => {
    try {
      await dispatch(updateCurrency({ id, data })).unwrap();
      toast.success('Currency updated successfully');
      navigate('/currency');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getCurrency(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT CURRENCY</PageHeading>
        <Breadcrumb items={[{ title: 'Currency' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <CurrencyForm mode="edit" onSubmit={onCurrencyUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditCurrency;
