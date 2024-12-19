import { Breadcrumb } from "antd";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AgentForm from "../../components/Form/AgentForm";
import PageHeading from "../../components/heading/PageHeading";
import useError from "../../hooks/useError";
import { createAgent } from "../../store/features/agentSlice";

const CreateAgent = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onAgentCreate = async (data) => {
    try {
      await dispatch(createAgent(data)).unwrap();
      toast.success("Agent created successfully");
      navigate("/agent");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>CREATE AGENT</PageHeading>
        <Breadcrumb
          items={[{ title: "Agent" }, { title: "Create" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white sm:p-4 p-2 rounded-md">
        <AgentForm onSubmit={onAgentCreate} />
      </div>
    </>
  );
};

export default CreateAgent;
