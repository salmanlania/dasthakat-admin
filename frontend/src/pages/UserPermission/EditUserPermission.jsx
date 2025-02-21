import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import UserPermissionForm from '../../components/Form/UserPermissionForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { getUserPermission, updateUserPermission } from '../../store/features/userPermissionSlice';

const EditUserPermission = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const navigate = useNavigate();

  const { id } = useParams();
  const { isFormLoading, permissionsGroup } = useSelector((state) => state.userPermission);

  useEffect(() => {
    dispatch(getUserPermission(id)).unwrap().catch(handleError);
  }, [id]);

  const onUpdatePermissionGroup = (values) => {
    dispatch(
      updateUserPermission({
        id,
        data: { ...values, permission: permissionsGroup }
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Permission updated successfully');
        navigate('/user-permission');
      })
      .catch(handleError);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT USER PERMISSION</PageHeading>
        <Breadcrumb items={[{ title: 'User Permission' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isFormLoading ? (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      ) : (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <UserPermissionForm mode="edit" onSubmit={onUpdatePermissionGroup} />
        </div>
      )}
    </>
  );
};
export default EditUserPermission;
