import { Breadcrumb, Spin } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import { getCompany, updateCompany } from "../../store/features/companySlice";
import EventForm from "../../components/Form/EventForm";

const EditEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.company
  );

  const onEventUpdate = async (data) => {
    try {
      await dispatch(updateCompany({ id, data })).unwrap();
      toast.success("Event updated successfully");
      navigate("/event");
    } catch (error) {
      handleError(error);
    }
  };

  // useEffect(() => {
  //   dispatch(getCompany(id)).unwrap().catch(handleError);
  // }, []);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>EDIT EVENT</PageHeading>
        <Breadcrumb
          items={[{ title: "Event" }, { title: "Edit" }]}
          separator=">"
        />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center bg-white  rounded-md">
          <Spin size="large" />
        </div>
      )}

      {/* {!isItemLoading && initialFormValues ? (
        <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
          <VesselForm mode="edit" onSubmit={onVesselUpdate} />
        </div>
      ) : null} */}

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <EventForm mode="edit" onSubmit={onEventUpdate} />
      </div>
    </>
  );
};

export default EditEvent;
