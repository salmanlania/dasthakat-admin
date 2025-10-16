import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../../components/Form/ProductForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';

const EditProduct = () => {
  useDocumentTitle('Edit Product');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();

  const onProductUpdate = async (data) => {
    try {
      toast.success('Product updated successfully');
      navigate('/product');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT PRODUCT</PageHeading>
        <Breadcrumb items={[{ title: 'Product' }, { title: 'Edit' }]} separator=">" />
      </div>

        {/* <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div> */}

        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <ProductForm mode="edit" onSubmit={onProductUpdate} />
        </div>
    </>
  );
};

export default EditProduct;
