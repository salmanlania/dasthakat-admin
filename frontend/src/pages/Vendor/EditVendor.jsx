import { Breadcrumb, Spin } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import VendorForm from "../../components/Form/VendorForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import { getVendor, updateVendor } from "../../store/features/vendorSlice";

const EditVendor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.vendor
  );

  const onVendorUpdate = async (data) => {
    try {
      await dispatch(updateVendor({ id, data })).unwrap();
      toast.success("Vendor updated successfully");
      navigate("/vendor");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getVendor(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>EDIT VENDOR</PageHeading>
        <Breadcrumb
          items={[{ title: "Vendor" }, { title: "Edit" }]}
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
          <VendorForm mode="edit" onSubmit={onVendorUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditVendor;
