import { Breadcrumb } from "antd";
import VendorForm from "../../components/Form/VendorForm";
import PageHeading from "../../components/heading/PageHeading";
import { useNavigate } from "react-router-dom";
import useError from "../../hooks/useError";
import { useDispatch } from "react-redux";
import { createVendor } from "../../store/features/vendorSlice";
import toast from "react-hot-toast";

const CreateVendor = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onVendorCreate = async (data) => {
    try {
      await dispatch(createVendor(data)).unwrap();
      toast.success("Vendor created successfully");
      navigate("/vendor");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>CREATE VENDOR</PageHeading>
        <Breadcrumb
          items={[{ title: "Vendor" }, { title: "Create" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <VendorForm onSubmit={onVendorCreate} />
      </div>
    </>
  );
};

export default CreateVendor;
