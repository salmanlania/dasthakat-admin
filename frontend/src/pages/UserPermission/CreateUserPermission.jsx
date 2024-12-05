import { Breadcrumb, Spin } from "antd";
import PageHeading from "../../components/heading/PageHeading";
import { useDispatch, useSelector } from "react-redux";
import useError from "../../hooks/useError";
import { useNavigate } from "react-router-dom";
import {
  createUserPermission,
  getUserPermissionForm,
} from "../../store/features/userPermissionSlice";
import toast from "react-hot-toast";
import { useEffect } from "react";
import UserPermissionForm from "../../components/Form/UserPermissionForm";

const CreateUserPermission = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const navigate = useNavigate();

  const { isFormLoading, permissionsGroup } = useSelector(
    (state) => state.userPermission
  );

  const onUpdatePermissionGroup = (values) => {
    dispatch(createUserPermission({ ...values, permission: permissionsGroup }))
      .unwrap()
      .then(() => {
        toast.success("Permission created successfully");
        navigate("/user-permission");
      })
      .catch(handleError);
  };

  useEffect(() => {
    dispatch(getUserPermissionForm()).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>CREATE USER PERMISSION</PageHeading>
        <Breadcrumb
          items={[{ title: "User Permission" }, { title: "Create" }]}
          separator=">"
        />
      </div>

      {isFormLoading ? (
        <div className="mt-4 flex min-h-96 items-center justify-center bg-white  rounded-md">
          <Spin size="large" />
        </div>
      ) : (
        <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
          <UserPermissionForm onSubmit={onUpdatePermissionGroup} />
        </div>
      )}
    </>
  );
};

export default CreateUserPermission;
