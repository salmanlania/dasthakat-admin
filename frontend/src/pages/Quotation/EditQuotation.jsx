import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import QuotationForm from '../../components/Form/QuotationForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { getQuotation, updateQuotation } from '../../store/features/quotationSlice';

const EditQuotation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.quotation);

  const onQuotationUpdate = async (data) => {
    try {
      await dispatch(updateQuotation({ id, data })).unwrap();
      toast.success('Quotation updated successfully');
      // navigate('/quotation');
      dispatch(getQuotation(id)).unwrap().catch(handleError);
    } catch (error) {
      handleError(error);
    }
  };
  const onQuotationUpdates = async (data) => {
    try {
      await dispatch(updateQuotation({ id, data })).unwrap();
      toast.success('Quotation updated successfully');
      navigate('/quotation');
    } catch (error) {

      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(getQuotation(id)).unwrap()
    } catch (error) {
      handleError(error)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT QUOTATION</PageHeading>
        <Breadcrumb items={[{ title: 'Quotation' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <QuotationForm mode="edit" onSubmit={onQuotationUpdate} onSave={onQuotationUpdates} />
        </div>
      ) : null}
    </>
  );
};

export default EditQuotation;
