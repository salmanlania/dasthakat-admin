import { Breadcrumb, Spin } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CompanyBranchForm from "../../components/Form/CompanyBranchForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import {
  getCompanyBranch,
  updateCompanyBranch,
} from "../../store/features/companyBranchSlice";

const EditCompanyBranch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.companyBranch
  );

  const onCompanyBranchUpdate = async (data) => {
    try {
      await dispatch(updateCompanyBranch({ id, data })).unwrap();
      toast.success("Branch updated successfully");
      navigate("/company-branch");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getCompanyBranch(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>EDIT COMPANY BRANCH</PageHeading>
        <Breadcrumb
          items={[{ title: "Company Branch" }, { title: "Edit" }]}
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
          <CompanyBranchForm mode="edit" onSubmit={onCompanyBranchUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditCompanyBranch;
