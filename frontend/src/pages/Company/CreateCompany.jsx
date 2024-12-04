import { Breadcrumb } from "antd";
import CompanyForm from "../../components/Form/CompanyForm";
import PageHeading from "../../components/heading/PageHeading";

const CreateCompany = () => {
  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>CREATE COMPANY</PageHeading>
        <Breadcrumb
          items={[{ title: "Company" }, { title: "Create" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <CompanyForm />
      </div>
    </>
  );
};

export default CreateCompany;
