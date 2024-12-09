import {
  Breadcrumb,
  Button,
  Input,
  Popconfirm,
  Select,
  Table,
  Tag,
  Tooltip,
} from "antd";
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
  bulkDeleteSupplier,
  deleteSupplier,
  getSupplierList,
  setSupplierDeleteIDs,
  setSupplierListParams,
} from "../../store/features/supplierSlice";

const Supplier = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const {
    list,
    isListLoading,
    params,
    paginationInfo,
    isBulkDeleting,
    deleteIDs,
  } = useSelector((state) => state.supplier);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedSupplierCode = useDebounce(params.supplier_code, 500);
  const debouncedName = useDebounce(params.name, 500);
  const debouncedLocation = useDebounce(params.location, 500);
  const debouncedContact1 = useDebounce(params.contact1, 500);
  const debouncedContact2 = useDebounce(params.contact2, 500);
  const debouncedEmail = useDebounce(params.email, 500);
  const debouncedAddress = useDebounce(params.address, 500);

  const onSupplierDelete = async (id) => {
    try {
      await dispatch(deleteSupplier(id)).unwrap();
      toast.success("Supplier deleted successfully");
      dispatch(getSupplierList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteSupplier(deleteIDs)).unwrap();
      toast.success("Suppliers deleted successfully");
      closeDeleteModal();
      await dispatch(getSupplierList(params)).unwrap();
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
            value={params.supplier_code}
            onChange={(e) =>
              dispatch(setSupplierListParams({ supplier_code: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "supplier_code",
      key: "supplier_code",
      sorter: true,
      width: 120,
      ellipsis: true,
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
              dispatch(setSupplierListParams({ name: e.target.value }))
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
          <p>Status</p>
          <Select
            className="w-full font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            options={[
              {
                value: 1,
                label: "Active",
              },
              {
                value: 0,
                label: "Inactive",
              },
            ]}
            allowClear
            value={params.status}
            onChange={(value) =>
              dispatch(setSupplierListParams({ status: value }))
            }
          />
        </div>
      ),
      dataIndex: "status",
      key: "status",
      sorter: true,
      render: (status) =>
        status === 1 ? (
          <Tag color="success" className="w-16 text-center">
            Active
          </Tag>
        ) : (
          <Tag color="error" className="w-16 text-center">
            Inactive
          </Tag>
        ),
      width: 120,
    },
    {
      title: (
        <div>
          <p>Location</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.location}
            onChange={(e) =>
              dispatch(setSupplierListParams({ location: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "location",
      key: "location",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Contact 1</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.contact1}
            onChange={(e) =>
              dispatch(setSupplierListParams({ contact1: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "contact1",
      key: "contact1",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Contact 2</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.contact2}
            onChange={(e) =>
              dispatch(setSupplierListParams({ contact2: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "contact2",
      key: "contact2",
      sorter: true,
      width: 150,
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
              dispatch(setSupplierListParams({ email: e.target.value }))
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
      title: (
        <div>
          <p>Address</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.address}
            onChange={(e) =>
              dispatch(setSupplierListParams({ address: e.target.value }))
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
      render: (_, { supplier_id }) => (
        <div className="flex gap-2 items-center">
          <Tooltip title="Edit">
            <Link to={`/supplier/edit/${supplier_id}`}>
              <Button
                size="small"
                type="primary"
                className="bg-gray-500 hover:!bg-gray-400"
                icon={<MdOutlineEdit size={14} />}
              />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete?"
              description="After deleting, You will not be able to recover it."
              okButtonProps={{ danger: true }}
              okText="Yes"
              cancelText="No"
              onConfirm={() => onSupplierDelete(supplier_id)}
            >
              <Button
                size="small"
                type="primary"
                danger
                icon={<GoTrash size={14} />}
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
      width: 70,
      fixed: "right",
    },
  ];

  useEffect(() => {
    dispatch(getSupplierList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.status,
    debouncedSearch,
    debouncedSupplierCode,
    debouncedName,
    debouncedLocation,
    debouncedContact1,
    debouncedContact2,
    debouncedEmail,
    debouncedAddress,
  ]);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>SUPPLIER</PageHeading>
        <Breadcrumb
          items={[{ title: "Supplier" }, { title: "List" }]}
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
              dispatch(setSupplierListParams({ search: e.target.value }))
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
            <Link to="/supplier/create">
              <Button type="primary">Add New</Button>
            </Link>
          </div>
        </div>

        <Table
          size="small"
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: deleteIDs,
            onChange: (selectedRowKeys) =>
              dispatch(setSupplierDeleteIDs(selectedRowKeys)),
          }}
          loading={isListLoading}
          className="mt-2"
          rowKey="supplier_id"
          scroll={{ x: "calc(100% - 200px)" }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} suppliers`,
          }}
          onChange={(e, b, c, d) => {
            dispatch(
              setSupplierListParams({
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
        title="Are you sure you want to delete these suppliers?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Supplier;
