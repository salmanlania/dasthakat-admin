import { Breadcrumb } from "antd";
import SupplierForm from "../../components/Form/SupplierForm";
import PageHeading from "../../components/heading/PageHeading";

const EditSupplier = () => {
  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>EDIT SUPPLIER</PageHeading>
        <Breadcrumb
          items={[{ title: "Supplier" }, { title: "Edit" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <SupplierForm />
      </div>
    </>
  );
};

export default EditSupplier;
