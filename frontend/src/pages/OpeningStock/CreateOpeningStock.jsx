import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OpeningStockForm from '../../components/Form/OpeningStockForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createOpeningStock } from '../../store/features/openingStockSlice';

const CreateOpeningStock = () => {
  useDocumentTitle('Create Opening Stock');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onOpeningStockCreate = async (data) => {
    try {
      const res = await dispatch(createOpeningStock(data)).unwrap();
      toast.success('Opening Stock created successfully');
      const createdId = res.data.data.opening_stock_id;
      navigate(`/opening-stock/edit/${createdId}`);
    } catch (error) {
      handleError(error);
    }
  };

  const onOpeningStockCreates = async (data) => {
    try {
      await dispatch(createOpeningStock(data)).unwrap();
      toast.success('Opening Stock created successfully');
      navigate('/opening-stock');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE OPENING STOCK</PageHeading>
        <Breadcrumb items={[{ title: 'Opening Stock' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <OpeningStockForm onSubmit={onOpeningStockCreate} onSave={onOpeningStockCreates} />
      </div>
    </>
  );
};

export default CreateOpeningStock;
