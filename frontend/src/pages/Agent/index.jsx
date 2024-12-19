import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoTrash } from "react-icons/go";
import { MdOutlineEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PageHeading from "../../components/heading/PageHeading";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import useDebounce from "../../hooks/useDebounce";
import useError from "../../hooks/useError";
import {
  bulkDeleteAgent,
  deleteAgent,
  getAgentList,
  setAgentDeleteIDs,
  setAgentListParams,
} from "../../store/features/agentSlice";

const Agent = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const {
    list,
    isListLoading,
    params,
    paginationInfo,
    isBulkDeleting,
    deleteIDs,
  } = useSelector((state) => state.agent);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.agent;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedCode = useDebounce(params.agent_code, 500);
  const debouncedName = useDebounce(params.name, 500);
  const debouncedAddress = useDebounce(params.address, 500);
  const debouncedCity = useDebounce(params.city, 500);
  const debouncedState = useDebounce(params.state, 500);
  const debouncedZipCode = useDebounce(params.zip_code, 500);
  const debouncedPhone = useDebounce(params.phone, 500);
  const debouncedFax = useDebounce(params.fax, 500);
  const debouncedEmail = useDebounce(params.email, 500);

  const onAgentDelete = async (id) => {
    try {
      await dispatch(deleteAgent(id)).unwrap();
      toast.success("Agent deleted successfully");
      dispatch(getAgentList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteAgent(deleteIDs)).unwrap();
      toast.success("Companies deleted successfully");
      closeDeleteModal();
      await dispatch(getAgentList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Code</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.agent_code}
            onChange={(e) =>
              dispatch(setAgentListParams({ agent_code: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "agent_code",
      key: "agent_code",
      sorter: true,
      width: 120,
    },
    {
      title: (
        <div>
          <p>Name</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.name}
            onChange={(e) =>
              dispatch(setAgentListParams({ name: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Physical Address</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.address}
            onChange={(e) =>
              dispatch(setAgentListParams({ address: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "address",
      key: "address",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>City</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.city}
            onChange={(e) =>
              dispatch(setAgentListParams({ city: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "city",
      key: "city",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>State</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.state}
            onChange={(e) =>
              dispatch(setAgentListParams({ state: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "state",
      key: "state",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Zip Code</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.zip_code}
            onChange={(e) =>
              dispatch(setAgentListParams({ zip_code: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "zip_code",
      key: "zip_code",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Phone</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.phone}
            onChange={(e) =>
              dispatch(setAgentListParams({ phone: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "phone",
      key: "phone",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Fax</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.fax}
            onChange={(e) =>
              dispatch(setAgentListParams({ fax: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "fax",
      key: "fax",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Email</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.email}
            onChange={(e) =>
              dispatch(setAgentListParams({ email: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "email",
      key: "email",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
      width: 168,
      render: (_, { created_at }) =>
        dayjs(created_at).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, { agent_id }) => (
        <div className="flex gap-2 items-center">
          {permissions.edit ? (
            <Tooltip title="Edit">
              <Link to={`/agent/edit/${agent_id}`}>
                <Button
                  size="small"
                  type="primary"
                  className="bg-gray-500 hover:!bg-gray-400"
                  icon={<MdOutlineEdit size={14} />}
                />
              </Link>
            </Tooltip>
          ) : null}
          {permissions.delete ? (
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure you want to delete?"
                description="After deleting, You will not be able to recover it."
                okButtonProps={{ danger: true }}
                okText="Yes"
                cancelText="No"
                onConfirm={() => onAgentDelete(agent_id)}
              >
                <Button
                  size="small"
                  type="primary"
                  danger
                  icon={<GoTrash size={14} />}
                />
              </Popconfirm>
            </Tooltip>
          ) : null}
        </div>
      ),
      width: 70,
      fixed: "right",
    },
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    dispatch(getAgentList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    debouncedSearch,
    debouncedCode,
    debouncedName,
    debouncedAddress,
    debouncedCity,
    debouncedState,
    debouncedZipCode,
    debouncedPhone,
    debouncedFax,
    debouncedEmail,
  ]);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>AGENT</PageHeading>
        <Breadcrumb
          items={[{ title: "Agent" }, { title: "List" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white p-2 rounded-md">
        <div className="flex justify-between items-center gap-2">
          <Input
            placeholder="Search..."
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) =>
              dispatch(setAgentListParams({ search: e.target.value }))
            }
          />

          <div className="flex gap-2 items-center">
            {permissions.delete ? (
              <Button
                type="primary"
                danger
                onClick={() => setDeleteModalIsOpen(true)}
                disabled={!deleteIDs.length}
              >
                Delete
              </Button>
            ) : null}
            {permissions.add ? (
              <Link to="/agent/create">
                <Button type="primary">Add New</Button>
              </Link>
            ) : null}
          </div>
        </div>

        <Table
          size="small"
          rowSelection={
            permissions.delete
              ? {
                  type: "checkbox",
                  selectedRowKeys: deleteIDs,
                  onChange: (selectedRowKeys) =>
                    dispatch(setAgentDeleteIDs(selectedRowKeys)),
                }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="agent_id"
          scroll={{ x: "calc(100% - 200px)" }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} agents`,
          }}
          onChange={(e, b, c, d) => {
            dispatch(
              setAgentListParams({
                page: e.current,
                limit: e.pageSize,
                sort_column: c.field,
                sort_direction: c.order,
              })
            );
          }}
          dataSource={list}
          showSorterTooltip={false}
          columns={columns}
          sticky={{
            offsetHeader: 56,
          }}
        />
      </div>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        onDelete={onBulkDelete}
        isDeleting={isBulkDeleting}
        title="Are you sure you want to delete these agents?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Agent;
