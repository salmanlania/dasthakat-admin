import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegSave } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { GoTrash } from "react-icons/go";
import { MdOutlineEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import AsyncSelect from "../../components/AsyncSelect";
import PageHeading from "../../components/heading/PageHeading";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import useDebounce from "../../hooks/useDebounce";
import useError from "../../hooks/useError";
import {
  addNewSubCategory,
  bulkDeleteSubCategory,
  createSubCategory,
  deleteSubCategory,
  getSubCategoryList,
  removeNewSubCategory,
  setSubCategoryDeleteIDs,
  setSubCategoryEditable,
  setSubCategoryListParams,
  updateSubCategory,
  updateSubCategoryListValue,
} from "../../store/features/subCategorySlice";

const SubCategory = () => {
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
  } = useSelector((state) => state.subCategory);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.sub_category;
  const categoryPermission =
    user.permission.category.list && user.permission.category.add;

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedName = useDebounce(params.name, 500);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const onChange = (id, field, value) => {
    dispatch(updateSubCategoryListValue({ id, field, value }));
  };

  const onCreate = async (record) => {
    const { name, category_id } = record;

    if (!name.trim()) return toast.error("Name field is required");
    if (!category_id) return toast.error("Category field is required");

    try {
      await dispatch(
        createSubCategory({
          name,
          category_id: category_id,
        })
      ).unwrap();
      await dispatch(getSubCategoryList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onUpdate = async (record) => {
    const { sub_category_id, name, category_id } = record;

    if (!name.trim()) return toast.error("Name field is required");
    if (!category_id) return toast.error("Category field is required");

    try {
      await dispatch(
        updateSubCategory({
          id: sub_category_id,
          data: { name, category_id: category_id },
        })
      ).unwrap();
      await dispatch(getSubCategoryList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onCancel = async (id) => {
    if (id === "new") return dispatch(removeNewSubCategory());
    dispatch(setSubCategoryEditable({ id, editable: false }));
  };

  const onSubCategoryDelete = async (id) => {
    try {
      await dispatch(deleteSubCategory(id)).unwrap();
      toast.success("SubCategory deleted successfully");
      dispatch(getSubCategoryList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteSubCategory(deleteIDs)).unwrap();
      toast.success("SubCategory deleted successfully");
      closeDeleteModal();
      await dispatch(getSubCategoryList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
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
              dispatch(setSubCategoryListParams({ name: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 120,
      ellipsis: true,
      render: (_, { name, editable, sub_category_id }) =>
        editable ? (
          <Input
            autoFocus
            defaultValue={name}
            onBlur={(e) => onChange(sub_category_id, "name", e.target.value)}
          />
        ) : (
          <span>{name}</span>
        ),
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Category</p>
          <AsyncSelect
            endpoint="/category"
            valueKey="category_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.category_id}
            onChange={(value) =>
              dispatch(setSubCategoryListParams({ category_id: value }))
            }
          />
        </div>
      ),
      dataIndex: "category_name",
      key: "category_name",
      sorter: true,
      width: 120,
      ellipsis: true,
      render: (_, { category_id, editable, category_name, sub_category_id }) =>
        editable ? (
          <AsyncSelect
            endpoint="/category"
            valueKey="category_id"
            className="w-full"
            labelKey="name"
            defaultValue={{
              value: category_id,
              label: category_name,
            }}
            labelInValue
            onChange={(selected) =>
              onChange(
                sub_category_id,
                "category_id",
                selected ? selected.value : null
              )
            }
            addNewLink={categoryPermission ? "/category" : null}
          />
        ) : (
          <span>{category_name}</span>
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
        const { sub_category_id, editable } = record;

        if (editable) {
          return (
            <div className="flex gap-2 items-center">
              <Tooltip title="Cancel" onClick={() => onCancel(sub_category_id)}>
                <Button danger icon={<FcCancel size={20} />} size="small" />
              </Tooltip>
              <Tooltip title="Save">
                <Button
                  type="primary"
                  size="small"
                  icon={<FaRegSave size={16} />}
                  loading={isSubmitting === sub_category_id}
                  onClick={() =>
                    sub_category_id === "new"
                      ? onCreate(record)
                      : onUpdate(record)
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
                      setSubCategoryEditable({
                        id: sub_category_id,
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
                  onConfirm={() => onSubCategoryDelete(sub_category_id)}
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
    dispatch(getSubCategoryList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.category_id,
    debouncedSearch,
    debouncedName,
  ]);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>SUB CATEGORY</PageHeading>
        <Breadcrumb
          items={[{ title: "SubCategory" }, { title: "List" }]}
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
              dispatch(setSubCategoryListParams({ search: e.target.value }))
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
              <Button
                type="primary"
                onClick={() => dispatch(addNewSubCategory())}
              >
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
                    dispatch(setSubCategoryDeleteIDs(selectedRowKeys)),
                  getCheckboxProps: (record) => ({
                    disabled: record.sub_category_id === "new",
                  }),
                }
              : null
          }
          onChange={(page, _, sorting) => {
            dispatch(
              setSubCategoryListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order,
              })
            );
          }}
          loading={isListLoading}
          rowKey="sub_category_id"
          className="mt-2"
          scroll={{ x: "calc(100% - 200px)" }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} subCategory`,
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
        title="Are you sure you want to delete these subCategory?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default SubCategory;
