import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegSave } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { GoTrash } from "react-icons/go";
import { MdOutlineEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import PageHeading from "../../components/heading/PageHeading";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import useError from "../../hooks/useError";
import {
  addNewValidity,
  bulkDeleteValidity,
  createValidity,
  deleteValidity,
  getValidityList,
  removeNewValidity,
  setValidityDeleteIDs,
  setValidityEditable,
  setValidityListParams,
  updateValidity,
  updateValidityListValue,
} from "../../store/features/validitySlice";
import useDebounce from "../../hooks/useDebounce";

const Validity = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const {
    list,
    isListLoading,
    params,
    paginationInfo,
    isBulkDeleting,
    isSubmitting,
    deleteIDs,
  } = useSelector((state) => state.validity);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.validity;

  const debouncedSearch = useDebounce(params.search, 500);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const onChange = (id, field, value) => {
    dispatch(updateValidityListValue({ id, field, value }));
  };

  const onCreate = async (record) => {
    const { name } = record;
    if (!name.trim()) return toast.error("Name field is required");

    try {
      await dispatch(createValidity({ name })).unwrap();
      await dispatch(getValidityList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onUpdate = async (record) => {
    const { validity_id, name } = record;

    if (!name.trim()) return toast.error("Name field is required");

    try {
      await dispatch(
        updateValidity({
          id: validity_id,
          data: { name },
        })
      ).unwrap();
      await dispatch(getValidityList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onCancel = async (id) => {
    if (id === "new") return dispatch(removeNewValidity());
    dispatch(setValidityEditable({ id, editable: false }));
  };

  const onValidityDelete = async (id) => {
    try {
      await dispatch(deleteValidity(id)).unwrap();
      toast.success("Validity deleted successfully");
      dispatch(getValidityList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteValidity(deleteIDs)).unwrap();
      toast.success("Validity deleted successfully");
      closeDeleteModal();
      await dispatch(getValidityList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 120,
      ellipsis: true,
      render: (_, { name, editable, validity_id }) =>
        editable ? (
          <Input
            autoFocus
            defaultValue={name}
            onBlur={(e) => onChange(validity_id, "name", e.target.value)}
          />
        ) : (
          <span>{name}</span>
        ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
      width: 168,
      render: (_, { created_at }) =>
        created_at ? (
          dayjs(created_at).format("DD-MM-YYYY hh:mm A")
        ) : (
          <span className="text-gray-400">AUTO</span>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const { validity_id, editable } = record;

        if (editable) {
          return (
            <div className="flex gap-2 items-center">
              <Tooltip title="Cancel" onClick={() => onCancel(validity_id)}>
                <Button danger icon={<FcCancel size={20} />} size="small" />
              </Tooltip>
              <Tooltip title="Save">
                <Button
                  type="primary"
                  size="small"
                  icon={<FaRegSave size={16} />}
                  loading={isSubmitting === validity_id}
                  onClick={() =>
                    validity_id === "new" ? onCreate(record) : onUpdate(record)
                  }
                />
              </Tooltip>
            </div>
          );
        }

        return (
          <div className="flex gap-2 items-center">
            {permissions.edit ? (
              <Tooltip title="Edit">
                <Button
                  size="small"
                  type="primary"
                  className="bg-gray-500 hover:!bg-gray-400"
                  icon={<MdOutlineEdit size={14} />}
                  onClick={() =>
                    dispatch(
                      setValidityEditable({
                        id: validity_id,
                        editable: true,
                      })
                    )
                  }
                />
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
                  onConfirm={() => onValidityDelete(validity_id)}
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
        );
      },
      width: 70,
      fixed: "right",
    },
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    dispatch(getValidityList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    debouncedSearch,
  ]);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>VALIDITY</PageHeading>
        <Breadcrumb
          items={[{ title: "Validity" }, { title: "List" }]}
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
              dispatch(setValidityListParams({ search: e.target.value }))
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
              <Button type="primary" onClick={() => dispatch(addNewValidity())}>
                Add New
              </Button>
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
                    dispatch(setValidityDeleteIDs(selectedRowKeys)),
                  getCheckboxProps: (record) => ({
                    disabled: record.validity_id === "new",
                  }),
                }
              : null
          }
          onChange={(e, b, c, d) => {
            dispatch(
              setValidityListParams({
                page: e.current,
                limit: e.pageSize,
                sort_column: c.field,
                sort_direction: c.order,
              })
            );
          }}
          loading={isListLoading}
          rowKey="validity_id"
          className="mt-2"
          scroll={{ x: "calc(100% - 200px)" }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} validity`,
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
        title="Are you sure you want to delete these validity?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Validity;
