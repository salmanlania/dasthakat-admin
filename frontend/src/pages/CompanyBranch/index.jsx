import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoTrash } from "react-icons/go";
import { MdOutlineEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AsyncSelectNoPaginate from "../../components/AsyncSelect/AsyncSelectNoPaginate";
import PageHeading from "../../components/heading/PageHeading";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import useDebounce from "../../hooks/useDebounce";
import useError from "../../hooks/useError";
import {
  bulkDeleteCompanyBranch,
  deleteCompanyBranch,
  getCompanyBranchList,
  setCompanyBranchDeleteIDs,
  setCompanyBranchListParams,
} from "../../store/features/companyBranchSlice";

const CompanyBranch = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const {
    list,
    isListLoading,
    params,
    paginationInfo,
    isBulkDeleting,
    deleteIDs,
  } = useSelector((state) => state.companyBranch);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.company_branch;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedName = useDebounce(params.name, 500);
  const debouncedCode = useDebounce(params.branch_code, 500);

  const onCompanyBranchDelete = async (id) => {
    try {
      await dispatch(deleteCompanyBranch(id)).unwrap();
      toast.success("Company deleted successfully");
      dispatch(getCompanyBranchList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteCompanyBranch(deleteIDs)).unwrap();
      toast.success("Branches deleted successfully");
      closeDeleteModal();
      await dispatch(getCompanyBranchList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Company</p>
          <AsyncSelectNoPaginate
            endpoint="/lookups/company"
            size="small"
            className="w-full font-normal"
            value={params.company}
            onChange={(value) =>
              dispatch(setCompanyBranchListParams({ company: value }))
            }
          />
        </div>
      ),
      dataIndex: "company_name",
      key: "company_name",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Branch Name</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.name}
            onChange={(e) =>
              dispatch(setCompanyBranchListParams({ name: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Branch Code</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.branch_code}
            onChange={(e) =>
              dispatch(
                setCompanyBranchListParams({ branch_code: e.target.value })
              )
            }
          />
        </div>
      ),
      dataIndex: "branch_code",
      key: "branch_code",
      sorter: true,
      width: 130,
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
      render: (_, { company_branch_id }) => (
        <div className="flex gap-2 items-center">
          {permissions.edit ? (
            <Tooltip title="Edit">
              <Link to={`/company-branch/edit/${company_branch_id}`}>
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
                onConfirm={() => onCompanyBranchDelete(company_branch_id)}
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
    dispatch(getCompanyBranchList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    debouncedSearch,
    debouncedName,
    debouncedCode,
    params.company,
  ]);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>COMPANY BRANCH</PageHeading>
        <Breadcrumb
          items={[{ title: "Company Branch" }, { title: "List" }]}
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
              dispatch(setCompanyBranchListParams({ search: e.target.value }))
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
              <Link to="/company-branch/create">
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
                    dispatch(setCompanyBranchDeleteIDs(selectedRowKeys)),
                }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="company_branch_id"
          scroll={{ x: "calc(100% - 200px)" }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} branches`,
          }}
          onChange={(page, _, sorting, d) => {
            dispatch(
              setCompanyBranchListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order,
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
        title="Are you sure you want to delete these branches?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default CompanyBranch;
