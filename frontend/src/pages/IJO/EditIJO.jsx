import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import IJOForm from '../../components/Form/IJOForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { getIJO, updateIJO } from '../../store/features/ijoSlice';

const EditIJO = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.ijo);

  const onIJOUpdate = async (data) => {
    try {
      await dispatch(updateIJO({ id, data })).unwrap();
      toast.success('Internal Job Order updated successfully');
      navigate('/ijo');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getIJO(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT INTERNAL JOB ORDER</PageHeading>
        <Breadcrumb items={[{ title: 'Internal Job Order' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <IJOForm mode="edit" onSubmit={onIJOUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditIJO;
