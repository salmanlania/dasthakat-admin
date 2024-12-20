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
  bulkDeleteCurrency,
  deleteCurrency,
  getCurrencyList,
  setCurrencyDeleteIDs,
  setCurrencyListParams,
} from "../../store/features/currencySlice";

const Currency = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const {
    list,
    isListLoading,
    params,
    paginationInfo,
    isBulkDeleting,
    deleteIDs,
  } = useSelector((state) => state.currency);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.currency;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedCode = useDebounce(params.currency_code, 500);
  const debouncedName = useDebounce(params.name, 500);
  const debouncedSymbolLeft = useDebounce(params.symbol_left, 500);
  const debouncedSymbolRight = useDebounce(params.symbol_right, 500);
  const debouncedValue = useDebounce(params.value, 500);

  const onCurrencyDelete = async (id) => {
    try {
      await dispatch(deleteCurrency(id)).unwrap();
      toast.success("Currency deleted successfully");
      dispatch(getCurrencyList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteCurrency(deleteIDs)).unwrap();
      toast.success("Currency deleted successfully");
      closeDeleteModal();
      await dispatch(getCurrencyList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Currency Code</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.currency_code}
            onChange={(e) =>
              dispatch(setCurrencyListParams({ currency_code: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "currency_code",
      key: "currency_code",
      sorter: true,
      width: 150,
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
              dispatch(setCurrencyListParams({ name: e.target.value }))
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
          <p>Symbol Left</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.symbol_left}
            onChange={(e) =>
              dispatch(setCurrencyListParams({ symbol_left: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "symbol_left",
      key: "symbol_left",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Symbol Right</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.symbol_right}
            onChange={(e) =>
              dispatch(setCurrencyListParams({ symbol_right: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "symbol_right",
      key: "symbol_right",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Value</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.value}
            onChange={(e) =>
              dispatch(setCurrencyListParams({ value: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "value",
      key: "value",
      sorter: true,
      width: 150,
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
            value={params.status}
            onChange={(value) =>
              dispatch(setCurrencyListParams({ status: value }))
            }
            allowClear
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
      render: (_, { currency_id }) => (
        <div className="flex gap-2 items-center">
          {permissions.edit ? (
            <Tooltip title="Edit">
              <Link to={`/currency/edit/${currency_id}`}>
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
                onConfirm={() => onCurrencyDelete(currency_id)}
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
    dispatch(getCurrencyList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.status,
    debouncedSearch,
    debouncedName,
    debouncedCode,
    debouncedSymbolLeft,
    debouncedSymbolRight,
    debouncedValue,
  ]);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>CURRENCY</PageHeading>
        <Breadcrumb
          items={[{ title: "Currency" }, { title: "List" }]}
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
              dispatch(setCurrencyListParams({ search: e.target.value }))
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
              <Link to="/currency/create">
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
                    dispatch(setCurrencyDeleteIDs(selectedRowKeys)),
                }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="currency_id"
          scroll={{ x: "calc(100% - 200px)" }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} currency`,
          }}
          onChange={(page, _, sorting, d) => {
            dispatch(
              setCurrencyListParams({
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
        isDeleting={isBulkDeleting}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these currency?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Currency;
