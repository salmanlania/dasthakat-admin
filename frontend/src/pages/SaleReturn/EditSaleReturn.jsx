import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SaleReturnForm from '../../components/Form/SaleReturnForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { getSaleReturn , updateSaleReturn} from '../../store/features/saleReturnSlice';

const EditSaleReturn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.saleReturn);

  const onSaleReturnUpdate = async (data) => {
    try {
      await dispatch(updateSaleReturn({ id, data })).unwrap();
      toast.success('Sale Return updated successfully');
      dispatch(getSaleReturn(id)).unwrap().catch(handleError);
    } catch (error) {
      handleError(error);
    }
  };
  const onSaleReturnUpdates = async (data) => {
    try {
      await dispatch(updateSaleReturn({ id, data })).unwrap();
      toast.success('Sale Return updated successfully');
      navigate('/sale-return');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getSaleReturn(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT SALE RETURN</PageHeading>
        <Breadcrumb items={[{ title: 'Sale Return' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <SaleReturnForm mode="edit" onSubmit={onSaleReturnUpdate} onSave={onSaleReturnUpdates} />
        </div>
      ) : null}
    </>
  );
};

export default EditSaleReturn;
