import { Breadcrumb, Spin } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import UserPermissionForm from "../../components/Form/UserPermissionForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import {
  getUserPermission,
  updateUserPermission,
} from "../../store/features/userPermissionSlice";

const EditUserPermission = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const navigate = useNavigate();

  const { id } = useParams();
  const { isFormLoading, permissionsGroup } = useSelector(
    (state) => state.userPermission
  );

  useEffect(() => {
    dispatch(getUserPermission(id)).unwrap().catch(handleError);
  }, [id]);

  const onUpdatePermissionGroup = (values) => {
    dispatch(
      updateUserPermission({
        id,
        data: { ...values, permission: permissionsGroup },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("User permission updated successfully");
        navigate("/user-permission");
      })
      .catch(handleError);
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>EDIT USER PERMISSION</PageHeading>
        <Breadcrumb
          items={[{ title: "User Permission" }, { title: "Edit" }]}
          separator=">"
        />
      </div>

      {isFormLoading ? (
        <div className="mt-4 flex min-h-96 items-center justify-center bg-white  rounded-md">
          <Spin size="large" />
        </div>
      ) : (
        <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
          <UserPermissionForm mode="edit" onSubmit={onUpdatePermissionGroup} />
        </div>
      )}
    </>
  );
};
export default EditUserPermission;
