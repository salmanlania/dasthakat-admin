import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import OpeningStockForm from '../../components/Form/OpeningStockForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { getOpeningStock, updateOpeningStock } from '../../store/features/openingStockSlice';

const EditOpeningStock = () => {
  useDocumentTitle('Edit Opening Stock');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.openingStock);

  const onOpeningStockUpdate = async (data) => {
    try {
      await dispatch(updateOpeningStock({ id, data })).unwrap();
      toast.success('Opening Stock updated successfully');
      dispatch(getOpeningStock(id)).unwrap().catch(handleError);
    } catch (error) {
      handleError(error);
    }
  };

  const onOpeningStockUpdates = async (data) => {
    try {
      await dispatch(updateOpeningStock({ id, data })).unwrap();
      toast.success('Opening Stock updated successfully');
      navigate('/opening-stock');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getOpeningStock(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT OPENING STOCK</PageHeading>
        <Breadcrumb items={[{ title: 'Opening Stock' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <OpeningStockForm
            mode="edit"
            onSubmit={onOpeningStockUpdate}
            onSave={onOpeningStockUpdates}
          />
        </div>
      ) : null}
    </>
  );
};

export default EditOpeningStock;
