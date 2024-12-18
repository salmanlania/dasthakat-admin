import { Breadcrumb, Spin } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CurrencyForm from "../../components/Form/CurrencyForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import {
  getCurrency,
  updateCurrency,
} from "../../store/features/currencySlice";

const EditCurrency = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.currency
  );

  const onCurrencyUpdate = async (data) => {
    try {
      await dispatch(updateCurrency({ id, data })).unwrap();
      toast.success("Currency updated successfully");
      navigate("/currency");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getCurrency(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>EDIT CURRENCY</PageHeading>
        <Breadcrumb
          items={[{ title: "Currency" }, { title: "Edit" }]}
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
          <CurrencyForm mode="edit" onSubmit={onCurrencyUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditCurrency;
