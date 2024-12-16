import {
  Breadcrumb,
  Button,
  DatePicker,
  Input,
  Popconfirm,
  Select,
  Table,
  Tooltip,
} from "antd";
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
  bulkDeleteCompany,
  deleteCompany,
  getCompanyList,
  setCompanyDeleteIDs,
  setCompanyListParams,
} from "../../store/features/companySlice";
import {
  bulkDeleteQuotation,
  deleteQuotation,
  getQuotationList,
  setQuotationDeleteIDs,
  setQuotationListParams,
} from "../../store/features/quotationSlice";

const Quotation = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const {
    list,
    isListLoading,
    params,
    paginationInfo,
    isBulkDeleting,
    deleteIDs,
  } = useSelector((state) => state.quotation);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedName = useDebounce(params.name, 500);

  const onQuotationDelete = async (id) => {
    try {
      await dispatch(deleteQuotation(id)).unwrap();
      toast.success("Quotation deleted successfully");
      dispatch(getQuotationList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteQuotation(deleteIDs)).unwrap();
      toast.success("Quotations deleted successfully");
      closeDeleteModal();
      await dispatch(getQuotationList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Document Date</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              size="small"
              value={params.document_data}
              className="font-normal"
              onChange={(date) =>
                dispatch(setQuotationListParams({ document_data: date }))
              }
              format="DD-MM-YYYY"
            />
          </div>
        </div>
      ),
      dataIndex: "document_date",
      key: "document_date",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Document No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.document_no}
            onChange={(e) =>
              dispatch(setQuotationListParams({ document_no: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "document_no",
      key: "document_no",
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
              dispatch(setQuotationListParams({ customer_id: value }))
            }
          />
          <Select size="small" className="w-full font-normal" />
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
              dispatch(setQuotationListParams({ vessel_id: value }))
            }
          />
          <Select size="small" className="w-full font-normal" />
        </div>
      ),
      dataIndex: "vessel_name",
      key: "vessel_name",
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
      render: (_, { quotation_id }) => (
        <div className="flex gap-2 items-center">
          <Tooltip title="Edit">
            <Link to={`/quotation/edit/${quotation_id}`}>
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
              onConfirm={() => onVesselDelete(quotation_id)}
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
    dispatch(getQuotationList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    debouncedSearch,
    debouncedName,
  ]);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>QUOTATION</PageHeading>
        <Breadcrumb
          items={[{ title: "Quotation" }, { title: "List" }]}
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
              dispatch(setQuotationListParams({ search: e.target.value }))
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
            <Link to="/quotation/create">
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
              dispatch(setQuotationDeleteIDs(selectedRowKeys)),
          }}
          loading={isListLoading}
          className="mt-2"
          rowKey="quotation_id"
          scroll={{ x: "calc(100% - 200px)" }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} quotations`,
          }}
          onChange={(e, b, c, d) => {
            dispatch(
              setQuotationListParams({
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
        title="Are you sure you want to delete these quotations?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Quotation;
