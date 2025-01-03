import { Breadcrumb } from "antd";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PurchaseOrderForm from "../../components/Form/PurchaseOrderForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import { createPurchaseOrder } from "../../store/features/purchaseOrderSlice";

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onPurchaseOrderCreate = async (data) => {
    try {
      await dispatch(createPurchaseOrder(data)).unwrap();
      toast.success("Purchase order created successfully");
      navigate("/purchase-order");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>CREATE PURCHASE ORDER</PageHeading>
        <Breadcrumb
          items={[{ title: "Purchase Order" }, { title: "Create" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <PurchaseOrderForm onSubmit={onPurchaseOrderCreate} />
      </div>
    </>
  );
};

export default CreatePurchaseOrder;
