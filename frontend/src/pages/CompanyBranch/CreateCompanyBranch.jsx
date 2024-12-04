import { Breadcrumb } from "antd";
import CompanyBranchForm from "../../components/Form/CompanyBranchForm";
import PageHeading from "../../components/heading/PageHeading";

const CreateCompany = () => {
  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>CREATE COMPANY BRANCH</PageHeading>
        <Breadcrumb
          items={[{ title: "Company Branch" }, { title: "Create" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <CompanyBranchForm />
      </div>
    </>
  );
};

export default CreateCompany;
