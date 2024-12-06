import { Breadcrumb } from "antd";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomerForm from "../../components/Form/CustomerForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import { createCustomer } from "../../store/features/customerSlice";

const CreateCustomer = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onCustomerCreate = async (data) => {
    try {
      await dispatch(createCustomer(data)).unwrap();
      toast.success("Customer created successfully");
      navigate("/customer");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>CREATE CUSTOMER</PageHeading>
        <Breadcrumb
          items={[{ title: "Customer" }, { title: "Create" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <CustomerForm onSubmit={onCustomerCreate} />
      </div>
    </>
  );
};

export default CreateCustomer;
