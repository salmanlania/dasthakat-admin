import { Breadcrumb } from "antd";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChargeOrderForm from "../../components/Form/ChargeOrderForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import { createChargeOrder } from "../../store/features/chargeOrderSlice";

const CreateChargeOrder = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onChargeOrderCreate = async (data) => {
    try {
      // await dispatch(createChargeOrder(data)).unwrap();
      // toast.success("ChargeOrder created successfully");
      // navigate("/chargeOrder");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>CREATE CHARGE ORDER</PageHeading>
        <Breadcrumb
          items={[{ title: "Charge Order" }, { title: "Create" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <ChargeOrderForm onSubmit={onChargeOrderCreate} />
      </div>
    </>
  );
};

export default CreateChargeOrder;
