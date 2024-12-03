import { Breadcrumb } from "antd";
import UserForm from "../../components/Form/UserForm";
import PageHeading from "../../components/heading/PageHeading";

const EditUser = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <PageHeading>EDIT USER</PageHeading>
        <Breadcrumb
          items={[{ title: "User" }, { title: "Edit" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <UserForm />
      </div>
    </>
  );
};

export default EditUser;
