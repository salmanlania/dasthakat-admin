import { Breadcrumb, Spin } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CustomerForm from "../../components/Form/CustomerForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import {
  getCustomer,
  updateCustomer,
} from "../../store/features/customerSlice";

const EditCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.customer
  );

  const onCustomerUpdate = async (data) => {
    try {
      await dispatch(updateCustomer({ id, data })).unwrap();
      toast.success("Customer updated successfully");
      navigate("/customer");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getCustomer(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>EDIT CUSTOMER</PageHeading>
        <Breadcrumb
          items={[{ title: "Customer" }, { title: "Edit" }]}
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
          <CustomerForm mode="edit" onSubmit={onCustomerUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditCustomer;
