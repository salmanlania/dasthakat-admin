import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import UserForm from '../../components/Form/UserForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { getUser, updateUser } from '../../store/features/userSlice';

const EditUser = () => {
  useDocumentTitle('Edit User');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.user);

  const onUserUpdate = async (data) => {
    try {
      await dispatch(updateUser({ id, data })).unwrap();
      toast.success('User updated successfully');
      navigate('/user');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getUser(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT USER</PageHeading>
        <Breadcrumb items={[{ title: 'User' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <UserForm mode="edit" onSubmit={onUserUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditUser;
