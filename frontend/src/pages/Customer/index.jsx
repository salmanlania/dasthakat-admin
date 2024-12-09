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
  bulkDeleteCustomer,
  deleteCustomer,
  getCustomerList,
  setCustomerDeleteIDs,
  setCustomerListParams,
} from "../../store/features/customerSlice";
import dayjs from "dayjs";

const Customer = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const {
    list,
    isListLoading,
    params,
    paginationInfo,
    isBulkDeleting,
    deleteIDs,
  } = useSelector((state) => state.customer);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.customer;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedCode = useDebounce(params.customer_code, 500);
  const debouncedName = useDebounce(params.name, 500);
  const debouncedSalesman = useDebounce(params.salesman, 500);
  const debouncedCountry = useDebounce(params.country, 500);
  const debouncedAddress = useDebounce(params.address, 500);
  const debouncedPhone = useDebounce(params.phone_no, 500);
  const debouncedEmailSales = useDebounce(params.email_sales, 500);
  const debouncedEmailAccounting = useDebounce(params.email_accounting, 500);
  const debouncedBillingAddress = useDebounce(params.billing_address, 500);

  const onCustomerDelete = async (id) => {
    try {
      await dispatch(deleteCustomer(id)).unwrap();
      toast.success("Customer deleted successfully");
      dispatch(getCustomerList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteCustomer(deleteIDs)).unwrap();
      toast.success("Companies deleted successfully");
      closeDeleteModal();
      await dispatch(getCustomerList(params)).unwrap();
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
            value={params.customer_code}
            onChange={(e) =>
              dispatch(setCustomerListParams({ customer_code: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "customer_code",
      key: "customer_code",
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
              dispatch(setCustomerListParams({ name: e.target.value }))
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
              dispatch(setCustomerListParams({ status: value }))
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
          <p>Sales Man</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.salesman}
            onChange={(e) =>
              dispatch(setCustomerListParams({ salesman: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "salesman",
      key: "salesman",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Country</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.country}
            onChange={(e) =>
              dispatch(setCustomerListParams({ country: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "country",
      key: "country",
      sorter: true,
      width: 150,
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
              dispatch(setCustomerListParams({ address: e.target.value }))
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
          <p>Phone No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.phone_no}
            onChange={(e) =>
              dispatch(setCustomerListParams({ phone_no: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "phone_no",
      key: "phone_no",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Email Sales</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.email_sales}
            onChange={(e) =>
              dispatch(setCustomerListParams({ email_sales: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "email_sales",
      key: "email_sales",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Email Accounting</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.email_accounting}
            onChange={(e) =>
              dispatch(
                setCustomerListParams({ email_accounting: e.target.value })
              )
            }
          />
        </div>
      ),
      dataIndex: "email_accounting",
      key: "email_accounting",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Billing Address</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.billing_address}
            onChange={(e) =>
              dispatch(
                setCustomerListParams({ billing_address: e.target.value })
              )
            }
          />
        </div>
      ),
      dataIndex: "billing_address",
      key: "billing_address",
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
      render: (_, { customer_id }) => (
        <div className="flex gap-2 items-center">
          {permissions.edit ? (
            <Tooltip title="Edit">
              <Link to={`/customer/edit/${customer_id}`}>
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
                onConfirm={() => onCustomerDelete(customer_id)}
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

  useEffect(() => {
    dispatch(getCustomerList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.status,
    debouncedSearch,
    debouncedCode,
    debouncedName,
    debouncedSalesman,
    debouncedCountry,
    debouncedAddress,
    debouncedPhone,
    debouncedEmailSales,
    debouncedEmailAccounting,
    debouncedBillingAddress,
  ]);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>CUSTOMER</PageHeading>
        <Breadcrumb
          items={[{ title: "Customer" }, { title: "List" }]}
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
              dispatch(setCustomerListParams({ search: e.target.value }))
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
              <Link to="/customer/create">
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
                    dispatch(setCustomerDeleteIDs(selectedRowKeys)),
                }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="customer_id"
          scroll={{ x: "calc(100% - 200px)" }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} customers`,
          }}
          onChange={(e, b, c, d) => {
            dispatch(
              setCustomerListParams({
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
        title="Are you sure you want to delete these customers?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Customer;
