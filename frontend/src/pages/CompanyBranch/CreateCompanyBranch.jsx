import { Breadcrumb } from "antd";
import CompanyBranchForm from "../../components/Form/CompanyBranchForm";
import PageHeading from "../../components/heading/PageHeading";
import { useNavigate } from "react-router-dom";
import useError from "../../hooks/useError";
import { useDispatch } from "react-redux";
import { createCompanyBranch } from "../../store/features/companyBranchSlice";
import toast from "react-hot-toast";

const CreateCompany = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onCompanyBranchCreate = async (data) => {
    try {
      await dispatch(createCompanyBranch(data)).unwrap();
      toast.success("Branch created successfully");
      navigate("/company-branch");
    } catch (error) {
      handleError(error);
    }
  };

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
        <CompanyBranchForm onSubmit={onCompanyBranchCreate} />
      </div>
    </>
  );
};

export default CreateCompany;
