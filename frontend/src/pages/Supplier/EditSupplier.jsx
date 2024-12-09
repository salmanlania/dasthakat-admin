import { Breadcrumb, Spin } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SupplierForm from "../../components/Form/SupplierForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import {
  getSupplier,
  updateSupplier,
} from "../../store/features/supplierSlice";

const EditSupplier = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.supplier
  );

  const onSupplierUpdate = async (data) => {
    try {
      await dispatch(updateSupplier({ id, data })).unwrap();
      toast.success("Supplier updated successfully");
      navigate("/supplier");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getSupplier(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>EDIT SUPPLIER</PageHeading>
        <Breadcrumb
          items={[{ title: "Supplier" }, { title: "Edit" }]}
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
          <SupplierForm mode="edit" onSubmit={onSupplierUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditSupplier;
