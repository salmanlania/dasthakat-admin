import { Breadcrumb, Spin } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CompanyForm from "../../components/Form/CompanyForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import { getCompany, updateCompany } from "../../store/features/companySlice";

const EditCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.company
  );

  const onCompanyUpdate = async (data) => {
    try {
      await dispatch(updateCompany({ id, data })).unwrap();
      toast.success("Company updated successfully");
      navigate("/company");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getCompany(id)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>EDIT COMPANY</PageHeading>
        <Breadcrumb
          items={[{ title: "Company" }, { title: "Edit" }]}
          separator=">"
        />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center bg-white  rounded-md">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
          <CompanyForm mode="edit" onSubmit={onCompanyUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditCompany;
