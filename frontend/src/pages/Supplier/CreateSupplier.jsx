import { Breadcrumb } from "antd";
import SupplierForm from "../../components/Form/SupplierForm";
import PageHeading from "../../components/heading/PageHeading";

const CreateSupplier = () => {
  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>CREATE SUPPLIER</PageHeading>
        <Breadcrumb
          items={[{ title: "Supplier" }, { title: "Create" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <SupplierForm />
      </div>
    </>
  );
};

export default CreateSupplier;
