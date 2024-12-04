import { Breadcrumb } from "antd";
import CompanyBranchForm from "../../components/Form/CompanyBranchForm";
import PageHeading from "../../components/heading/PageHeading";

const EditCompanyBranch = () => {
  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>EDIT COMPANY BRANCH</PageHeading>
        <Breadcrumb
          items={[{ title: "Company Branch" }, { title: "Edit" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <CompanyBranchForm />
      </div>
    </>
  );
};

export default EditCompanyBranch;
