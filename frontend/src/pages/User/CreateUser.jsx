import { Breadcrumb } from "antd";
import UserForm from "../../components/Form/UserForm";
import PageHeading from "../../components/heading/PageHeading";

const CreateUser = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <PageHeading>CREATE USER</PageHeading>
        <Breadcrumb
          items={[{ title: "User" }, { title: "Create" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <UserForm />
      </div>
    </>
  );
};

export default CreateUser;
