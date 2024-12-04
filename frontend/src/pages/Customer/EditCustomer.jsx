import { Breadcrumb } from "antd";
import CustomerForm from "../../components/Form/CustomerForm";
import PageHeading from "../../components/heading/PageHeading";

const EditCustomer = () => {
  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>EDIT CUSTOMER</PageHeading>
        <Breadcrumb
          items={[{ title: "Customer" }, { title: "Edit" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <CustomerForm />
      </div>
    </>
  );
};

export default EditCustomer;
