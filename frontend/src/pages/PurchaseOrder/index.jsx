import {
  Breadcrumb,
  Button,
  DatePicker,
  Input,
  Popconfirm,
  Select,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegFilePdf } from 'react-icons/fa';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit, MdCancel } from 'react-icons/md';
import { FaFileInvoice } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import ChargeOrderModal from '../../components/Modals/ChargeOrderModal';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import {
  bulkDeletePurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderForPrint,
  getPurchaseOrderList,
  setPurchaseOrderDeleteIDs,
  setPurchaseOrderListParams,
  cancelledPurchaseOrder
} from '../../store/features/purchaseOrderSlice';
import { createPurchaseInvoice } from '../../store/features/purchaseInvoiceSlice';
import { createPurchaseOrderPrint } from '../../utils/prints/purchase-order-print';
import { createPurchaseOrderWithoutRatePrint } from '../../utils/prints/purchase-order-print-without-rate';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export const purchaseOrderTypes = [
  {
    value: 'Inventory',
    label: 'Inventory',
  },
  {
    value: 'Buyout',
    label: 'Buyout',
  },
];

const PurchaseOrder = () => {
  useDocumentTitle('Purchase Order List');
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.purchaseOrder,
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.purchase_order;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedPurchaseOrderNo = useDebounce(params.document_identity, 500);
  const debouncedChargeNo = useDebounce(params.charge_no, 500);
  const debouncedQuotationNo = useDebounce(params.quotation_no, 500);

  const GRNStatus = {
    1: 'Complete',
    2: 'Partial',
    3: 'In Progress',
  };
  const formattedParams = {
    ...params,
    document_date: params.document_date ? dayjs(params.document_date).format('YYYY-MM-DD') : null,
  };

  const onPurchaseOrderDelete = async (id) => {
    try {
      await dispatch(deletePurchaseOrder(id)).unwrap();
      toast.success('Purchase order deleted successfully');
      dispatch(getPurchaseOrderList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onPurchaseOrderCancel = async (id) => {
    try {
      await dispatch(cancelledPurchaseOrder(id)).unwrap();
      toast.success('Purchase order cancelled successfully');
      dispatch(getPurchaseOrderList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeletePurchaseOrder(deleteIDs)).unwrap();
      toast.success('Purchase orders deleted successfully');
      closeDeleteModal();
      await dispatch(getPurchaseOrderList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const printPurchaseOrder = async (id) => {
    const loadingToast = toast.loading('Loading print...');

    try {
      const data = await dispatch(getPurchaseOrderForPrint(id)).unwrap();
      toast.dismiss(loadingToast);
      createPurchaseOrderPrint(data);
    } catch (error) {
      handleError(error);
    }
  };

  const printPurchaseOrderWithoutRate = async (id) => {
    const loadingToast = toast.loading('Loading print...');

    try {
      const data = await dispatch(getPurchaseOrderForPrint(id)).unwrap();
      toast.dismiss(loadingToast);
      createPurchaseOrderWithoutRatePrint(data);
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Purchase Order Date</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              size="small"
              value={params.document_date}
              className="font-normal"
              onChange={(date) => dispatch(setPurchaseOrderListParams({ document_date: date }))}
              format="MM-DD-YYYY"
            />
          </div>
        </div>
      ),
      dataIndex: 'document_date',
      key: 'document_date',
      sorter: true,
      width: 180,
      ellipsis: true,
      render: (_, { document_date }) =>
        document_date ? dayjs(document_date).format('MM-DD-YYYY') : null,
    },
    {
      title: (
        <div>
          <p>Purchase Order No</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.document_identity}
            onChange={(e) =>
              dispatch(
                setPurchaseOrderListParams({
                  document_identity: e.target.value,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: 'document_identity',
      key: 'document_identity',
      sorter: true,
      width: 165,
      ellipsis: true,
      render: (text, record) => (
        <span>
          {record.is_deleted === 1 ? (
            <>
              {text} <span style={{ color: 'red' }}>(Cancelled)</span>
            </>
          ) : (
            text
          )}
        </span>
      ),
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Purchase Order Type</p>
          <Select
            className="w-full font-normal"
            size="small"
            allowClear
            value={params.type}
            options={purchaseOrderTypes}
            onChange={(e) =>
              dispatch(
                setPurchaseOrderListParams({
                  type: e,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: 'type',
      key: 'type',
      sorter: true,
      width: 180,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Vendor</p>
          <AsyncSelect
            endpoint="/supplier"
            size="small"
            className="w-full font-normal"
            valueKey="supplier_id"
            labelKey="name"
            value={params.supplier_id}
            onChange={(value) => dispatch(setPurchaseOrderListParams({ supplier_id: value }))}
          />
        </div>
      ),
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      sorter: true,
      width: 200,
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
            onChange={(value) => dispatch(setPurchaseOrderListParams({ customer_id: value }))}
          />
        </div>
      ),
      dataIndex: 'customer_name',
      key: 'customer_name',
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Charge No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.charge_no}
            onChange={(e) =>
              dispatch(
                setPurchaseOrderListParams({
                  charge_no: e.target.value,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: 'charge_no',
      key: 'charge_no',
      sorter: true,
      width: 120,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Quotation No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.quotation_no}
            onChange={(e) =>
              dispatch(
                setPurchaseOrderListParams({
                  quotation_no: e.target.value,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: 'quotation_no',
      key: 'quotation_no',
      sorter: true,
      width: 140,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Event</p>
          <AsyncSelect
            endpoint="/event"
            size="small"
            className="w-full font-normal"
            valueKey="event_id"
            labelKey="event_code"
            value={params.event_id}
            onChange={(value) => dispatch(setPurchaseOrderListParams({ event_id: value }))}
          />
        </div>
      ),
      dataIndex: 'event_code',
      key: 'event_code',
      sorter: true,
      width: 140,
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
            onChange={(value) => dispatch(setPurchaseOrderListParams({ vessel_id: value }))}
          />
        </div>
      ),
      dataIndex: 'vessel_name',
      key: 'vessel_name',
      sorter: true,
      width: 140,
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
                label: GRNStatus[1],
              },
              {
                value: 2,
                label: GRNStatus[2],
              },
              {
                value: 3,
                label: GRNStatus[3],
              },
            ]}
            value={params.grn_status}
            onChange={(value) => dispatch(setPurchaseOrderListParams({ grn_status: value }))}
            allowClear
          />
        </div>
      ),
      dataIndex: 'grn_status',
      key: 'grn_status',
      sorter: true,
      render: (_, { grn_status }) => {
        if (grn_status == 1) {
          return (
            <div className="flex items-center justify-center">
              <Tag color="success" className="w-28 text-center">
                {GRNStatus[1]}
              </Tag>
            </div>
          );
        } else if (grn_status == 2) {
          return (
            <div className="flex items-center justify-center">
              <Tag color="yellow" className="w-28 text-center">
                {GRNStatus[2]}
              </Tag>
            </div>
          );
        } else {
          return (
            <div className="flex items-center justify-center">
              <Tag color="volcano" className="w-28 text-center">
                {GRNStatus[3]}
              </Tag>
            </div>
          );
        }
      },
      width: 140,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      width: 168,
      render: (_, { created_at }) => dayjs(created_at).format('MM-DD-YYYY hh:mm A'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record, { purchase_order_id }) => {
        return (
          <div className="flex flex-wrap items-center gap-2">
            {permissions.edit ? (
              <>
                <Tooltip title="Print without rate">
                  <Button
                    size="small"
                    type="primary"
                    className="bg-indigo-600 hover:!bg-indigo-500"
                    icon={<FaRegFilePdf size={14} />}
                    onClick={() => printPurchaseOrderWithoutRate(purchase_order_id)}
                  />
                </Tooltip>
                <Tooltip title="Print">
                  <Button
                    size="small"
                    type="primary"
                    className="bg-rose-600 hover:!bg-rose-500"
                    icon={<FaRegFilePdf size={14} />}
                    onClick={() => printPurchaseOrder(purchase_order_id)}
                  />
                </Tooltip>
                <Tooltip title="Edit">
                  <Link to={`/purchase-order/edit/${purchase_order_id}`}>
                    <Button
                      size="small"
                      type="primary"
                      className="bg-gray-500 hover:!bg-gray-400"
                      icon={<MdOutlineEdit size={14} />}
                    />
                  </Link>
                </Tooltip>
              </>
            ) : null}
            {permissions.delete && record.is_deleted !== 1 ? (
              <Tooltip title="Delete">
                <Popconfirm
                  title="Are you sure you want to delete?"
                  description="After deleting, You will not be able to recover it."
                  okButtonProps={{ danger: true }}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => onPurchaseOrderDelete(purchase_order_id)}>
                  <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
                </Popconfirm>
              </Tooltip>
            ) : null}
            {record.is_deleted !== 1 ? (
              <Tooltip title="Purchase Invoice">
                <Button
                  size="small"
                  type="primary"
                  className="bg-indigo-600 hover:!bg-indigo-500"
                  icon={<FaFileInvoice size={14} />}
                  onClick={async () => {
                    try {
                      const document_date = dayjs().format('YYYY-MM-DD');
                      await dispatch(
                        createPurchaseInvoice({ purchase_order_id, document_date }),
                      ).unwrap();
                      toast.success('Purchase invoice created successfully');
                    } catch (error) {
                      handleError(error);
                    }
                  }}
                />
              </Tooltip>
            ) : null}
            {record.is_deleted !== 1 && permissions.cancel ? (
              <Tooltip title="Cancel">
                <Popconfirm
                  title="Are you sure you want to cancel?"
                  description="After cancelling, You will not be able to recover it."
                  okButtonProps={{ danger: true }}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => onPurchaseOrderCancel(purchase_order_id)}
                >
                  <Button className='bg-teal-500-500 hover:!bg-teal-500-400' size="small" type="primary" icon={<MdCancel size={14} />} />
                </Popconfirm>
              </Tooltip>
            ) : null}
          </div>
        )
      },
      width: 105,
      fixed: 'right',
    },
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getPurchaseOrderList(formattedParams)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.document_date,
    params.customer_id,
    params.supplier_id,
    params.type,
    params.grn_status,
    params.event_id,
    params.vessel_id,
    debouncedSearch,
    debouncedPurchaseOrderNo,
    debouncedChargeNo,
    debouncedQuotationNo,
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>PURCHASE ORDER</PageHeading>
        <Breadcrumb items={[{ title: 'Purchase Order' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setPurchaseOrderListParams({ search: e.target.value }))}
          />

          <div className="flex items-center gap-2">
            {permissions.delete ? (
              <Button
                type="primary"
                danger
                onClick={() => setDeleteModalIsOpen(true)}
                disabled={!deleteIDs.length}>
                Delete
              </Button>
            ) : null}
            {permissions.add ? (
              <Link to="/purchase-order/create">
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
                type: 'checkbox',
                selectedRowKeys: deleteIDs,
                onChange: (selectedRowKeys) =>
                  dispatch(setPurchaseOrderDeleteIDs(selectedRowKeys)),
              }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="purchase_order_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} purchase orders`,
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setPurchaseOrderListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order,
              }),
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
        title="Are you sure you want to delete these purchase orders?"
        description="After deleting, you will not be able to recover."
      />

      <ChargeOrderModal />
    </>
  );
};

export default PurchaseOrder;
