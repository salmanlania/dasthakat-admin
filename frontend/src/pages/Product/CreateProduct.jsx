import { Breadcrumb } from "antd";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/Form/ProductForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import { createProduct } from "../../store/features/productSlice";

const CreateProduct = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onProductCreate = async (data) => {
    try {
      await dispatch(createProduct(data)).unwrap();
      toast.success("Product created successfully");
      navigate("/product");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>CREATE PRODUCT</PageHeading>
        <Breadcrumb
          items={[{ title: "Product" }, { title: "Create" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <ProductForm onSubmit={onProductCreate} />
      </div>
    </>
  );
};

export default CreateProduct;
