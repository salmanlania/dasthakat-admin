import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserForm from '../../components/Form/UserForm';
import PageHeading from '../../components/heading/PageHeading';
import useError from '../../hooks/useError';
import { createUser } from '../../store/features/userSlice';

const CreateUser = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onUserCreate = async (data) => {
    try {
      await dispatch(createUser(data)).unwrap();
      toast.success('User created successfully');
      navigate('/user');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE USER</PageHeading>
        <Breadcrumb items={[{ title: 'User' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <UserForm onSubmit={onUserCreate} />
      </div>
    </>
  );
};

export default CreateUser;
