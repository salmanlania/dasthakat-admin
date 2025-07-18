import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import StockReturnForm from '../../components/Form/stockReturnForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { getStockReturn, updateStockReturn } from '../../store/features/stockReturnSlice';

const EditStockReturn = () => {
  useDocumentTitle('Edit Stock Return');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.stockReturn);

  const onStockReturnUpdate = async (data) => {
    try {
      await dispatch(updateStockReturn({ id, data })).unwrap();
      toast.success('Stock Return updated successfully');
      dispatch(getStockReturn(id)).unwrap().catch(handleError);
    } catch (error) {
      handleError(error);
    }
  };
  const onStockReturnUpdates = async (data) => {
    try {
      await dispatch(updateStockReturn({ id, data })).unwrap();
      toast.success('Stock Return updated successfully');
      navigate('/stock-return');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getStockReturn(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT STOCK RETURN</PageHeading>
        <Breadcrumb items={[{ title: 'Stock Return' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <StockReturnForm
            mode="edit"
            onSubmit={onStockReturnUpdate}
            onSave={onStockReturnUpdates}
          />
        </div>
      ) : null}
    </>
  );
};

export default EditStockReturn;
