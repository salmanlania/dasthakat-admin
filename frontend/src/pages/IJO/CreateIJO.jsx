import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import IJOForm from '../../components/Form/IJOForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createIJO } from '../../store/features/ijoSlice';

const CreateIJO = () => {
  useDocumentTitle('Create IJO');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onIJOCreate = async (data) => {
    try {
      const res = await dispatch(createIJO(data)).unwrap();
      toast.success('IJO created successfully');
      navigate(`/ijo/edit/${res?.data?.data?.job_order_id}`);
    } catch (error) {
      handleError(error);
    }
  };

  const onIJOSaveAndExit = async (data) => {
    try {
      await dispatch(createIJO(data)).unwrap();
      toast.success('IJO created successfully');
      navigate('/ijo');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE IJO</PageHeading>
        <Breadcrumb items={[{ title: 'IJO' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <IJOForm onSubmit={onIJOCreate} onSave={onIJOSaveAndExit} />
      </div>
    </>
  );
};

export default CreateIJO;
