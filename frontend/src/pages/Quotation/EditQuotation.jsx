import { Breadcrumb, Spin } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import QuotationForm from "../../components/Form/QuotationForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import {
  getQuotation,
  updateQuotation,
} from "../../store/features/quotationSlice";

const EditQuotation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.quotation
  );

  const onQuotationUpdate = async (data) => {
    try {
      await dispatch(updateQuotation({ id, data })).unwrap();
      toast.success("Quotation updated successfully");
      navigate("/quotation");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getQuotation(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>EDIT QUOTATION</PageHeading>
        <Breadcrumb
          items={[{ title: "Quotation" }, { title: "Edit" }]}
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
          <QuotationForm mode="edit" onSubmit={onQuotationUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditQuotation;
