import { Breadcrumb } from "antd";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import VesselForm from "../../components/Form/VesselForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import { createVessel } from "../../store/features/vesselSlice";

const CreateVessel = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onVesselCreate = async (data) => {
    try {
      await dispatch(createVessel(data)).unwrap();
      toast.success("Vessel created successfully");
      navigate("/vessel");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>CREATE VESSEL</PageHeading>
        <Breadcrumb
          items={[{ title: "Vessel" }, { title: "Create" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <VesselForm onSubmit={onVesselCreate} />
      </div>
    </>
  );
};

export default CreateVessel;
