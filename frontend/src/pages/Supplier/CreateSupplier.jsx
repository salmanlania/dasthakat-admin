import { Breadcrumb } from "antd";
import SupplierForm from "../../components/Form/SupplierForm";
import PageHeading from "../../components/heading/PageHeading";
import { useNavigate } from "react-router-dom";
import useError from "../../hooks/useError";
import { useDispatch } from "react-redux";
import { createSupplier } from "../../store/features/supplierSlice";
import toast from "react-hot-toast";

const CreateSupplier = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onSupplierCreate = async (data) => {
    try {
      await dispatch(createSupplier(data)).unwrap();
      toast.success("Supplier created successfully");
      navigate("/supplier");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>CREATE SUPPLIER</PageHeading>
        <Breadcrumb
          items={[{ title: "Supplier" }, { title: "Create" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <SupplierForm onSubmit={onSupplierCreate} />
      </div>
    </>
  );
};

export default CreateSupplier;
