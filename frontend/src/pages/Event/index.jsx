import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoTrash } from "react-icons/go";
import { MdOutlineEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AsyncSelect from "../../components/AsyncSelect";
import PageHeading from "../../components/heading/PageHeading";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import useDebounce from "../../hooks/useDebounce";
import useError from "../../hooks/useError";
import {
  bulkDeleteEvent,
  deleteEvent,
  getEventList,
  setEventDeleteIDs,
  setEventListParams,
} from "../../store/features/eventSlice";

const Event = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const {
    list,
    isListLoading,
    params,
    paginationInfo,
    isBulkDeleting,
    deleteIDs,
  } = useSelector((state) => state.event);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.event;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedCode = useDebounce(params.event_code, 500);

  const onEventDelete = async (id) => {
    try {
      await dispatch(deleteEvent(id)).unwrap();
      toast.success("Event deleted successfully");
      dispatch(getEventList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteEvent(deleteIDs)).unwrap();
      toast.success("Events deleted successfully");
      closeDeleteModal();
      await dispatch(getEventList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Event Code</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.event_code}
            onChange={(e) =>
              dispatch(setEventListParams({ event_code: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "event_code",
      key: "event_code",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Customer</p>
          <AsyncSelect
            endpoint="/customer"
            size="small"
            className="w-full font-normal"
            valueKey="customer_id"
            labelKey="name"
            value={params.customer_id}
            onChange={(value) =>
              dispatch(setEventListParams({ customer_id: value }))
            }
          />
        </div>
      ),
      dataIndex: "customer_name",
      key: "customer_name",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Vessel</p>
          <AsyncSelect
            endpoint="/vessel"
            size="small"
            className="w-full font-normal"
            valueKey="vessel_id"
            labelKey="name"
            value={params.vessel_id}
            onChange={(value) =>
              dispatch(setEventListParams({ vessel_id: value }))
            }
          />
        </div>
      ),
      dataIndex: "vessel_name",
      key: "vessel_name",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Class 1</p>
          <AsyncSelect
            endpoint="/class"
            size="small"
            className="w-full font-normal"
            valueKey="class_id"
            labelKey="name"
            value={params.class1_id}
            onChange={(value) =>
              dispatch(setEventListParams({ class1_id: value }))
            }
          />
        </div>
      ),
      dataIndex: "class1_name",
      key: "class1_name",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Class 2</p>
          <AsyncSelect
            endpoint="/class"
            size="small"
            className="w-full font-normal"
            valueKey="class_id"
            labelKey="name"
            value={params.class2_id}
            onChange={(value) =>
              dispatch(setEventListParams({ class2_id: value }))
            }
          />
        </div>
      ),
      dataIndex: "class2_name",
      key: "class2_name",
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
      render: (_, { event_id }) => (
        <div className="flex gap-2 items-center">
          {permissions.edit ? (
            <Tooltip title="Edit">
              <Link to={`/event/edit/${event_id}`}>
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
                onConfirm={() => onEventDelete(event_id)}
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
    dispatch(getEventList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.customer_id,
    params.vessel_id,
    params.class1_id,
    params.class2_id,
    debouncedSearch,
    debouncedCode,
  ]);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>EVENT</PageHeading>
        <Breadcrumb
          items={[{ title: "Event" }, { title: "List" }]}
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
              dispatch(setEventListParams({ search: e.target.value }))
            }
          />

          <div className="flex gap-2 items-center">
            <Button
              type="primary"
              danger
              onClick={() => setDeleteModalIsOpen(true)}
              disabled={!deleteIDs.length}
            >
              Delete
            </Button>
            {permissions.add ? (
              <Link to="/event/create">
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
                    dispatch(setEventDeleteIDs(selectedRowKeys)),
                }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="event_id"
          scroll={{ x: "calc(100% - 200px)" }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} events`,
          }}
          onChange={(e, b, c) => {
            dispatch(
              setEventListParams({
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
        isDeleting={isBulkDeleting}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these events?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Event;
