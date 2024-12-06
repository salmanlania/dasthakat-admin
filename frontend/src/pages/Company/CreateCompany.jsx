import { Breadcrumb } from "antd";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CompanyForm from "../../components/Form/CompanyForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import { createCompany } from "../../store/features/companySlice";

const CreateCompany = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onCompanyCreate = async (data) => {
    try {
      await dispatch(createCompany(data)).unwrap();
      toast.success("Company created successfully");
      navigate("/company");
    } catch (error) {
      handleError(error);
    }
  };

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
        <CompanyForm onSubmit={onCompanyCreate} />
      </div>
    </>
  );
};

export default CreateCompany;
