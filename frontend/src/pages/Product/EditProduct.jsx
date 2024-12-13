import { Breadcrumb, Spin } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/Form/ProductForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import { getProduct, updateProduct } from "../../store/features/productSlice";

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.product
  );

  const onProductUpdate = async (data) => {
    try {
      await dispatch(updateProduct({ id, data })).unwrap();
      toast.success("Product updated successfully");
      navigate("/product");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getProduct(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>EDIT PRODUCT</PageHeading>
        <Breadcrumb
          items={[{ title: "Product" }, { title: "Edit" }]}
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
          <ProductForm mode="edit" onSubmit={onProductUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditProduct;
