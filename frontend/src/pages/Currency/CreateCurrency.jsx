import { Breadcrumb } from "antd";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CurrencyForm from "../../components/Form/CurrencyForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import { createCurrency } from "../../store/features/currencySlice";

const CreateCurrency = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onCurrencyCreate = async (data) => {
    try {
      await dispatch(createCurrency(data)).unwrap();
      toast.success("Currency created successfully");
      navigate("/currency");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>CREATE CURRENCY</PageHeading>
        <Breadcrumb
          items={[{ title: "Currency" }, { title: "Create" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <CurrencyForm onSubmit={onCurrencyCreate} />
      </div>
    </>
  );
};

export default CreateCurrency;
