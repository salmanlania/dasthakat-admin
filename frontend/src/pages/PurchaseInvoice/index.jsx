import { Breadcrumb, Button, DatePicker, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import AsyncSelect from '../../components/AsyncSelect';
import {
  bulkDeletePurchaseInvoice,
  deletePurchaseInvoice,
  getPurchaseInvoiceForPrint,
  getPurchaseInvoiceList,
  setPurchaseInvoiceDeleteIDs,
  setPurchaseInvoiceListParams,
} from '../../store/features/purchaseInvoiceSlice';
import { createPurchaseInvoicePrint } from '../../utils/prints/purchase-invoice-print';

const PurchaseInvoice = () => {
  useDocumentTitle('Purchase Invoice List');
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.purchaseInvoice,
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.purchase_invoice;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedPurchaseInvoiceNo = useDebounce(params.document_identity, 500);
  const debouncedChargeNo = useDebounce(params.charge_no, 500);
  const debouncedQuotationNo = useDebounce(params.quotation_no, 500);

  const formattedParams = {
    ...params,
    document_date: params.document_date ? dayjs(params.document_date).format('YYYY-MM-DD') : null,
  };

  const onPurchaseInvoiceDelete = async (id) => {
    try {
      await dispatch(deletePurchaseInvoice(id)).unwrap();
      toast.success('Purchase Invoice deleted successfully');
      dispatch(getPurchaseInvoiceList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    closeDeleteModal();
    try {
      await dispatch(bulkDeletePurchaseInvoice(deleteIDs)).unwrap();
      toast.success('Purchase invoice deleted successfully');
      closeDeleteModal();
      await dispatch(getPurchaseInvoiceList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const printPurchaseInvoice = async (id) => {
    const loadingToast = toast.loading('Loading print...');

    try {
      const data = await dispatch(getPurchaseInvoiceForPrint(id)).unwrap();
      toast.dismiss(loadingToast);
      createPurchaseInvoicePrint(data);
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Purchase Invoice Date</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              allowClearf
              size="small"
              value={params.document_date}
              className="font-normal"
              onChange={(date) => dispatch(setPurchaseInvoiceListParams({ document_date: date }))}
              format="MM-DD-YYYY"
            />
          </div>
        </div>
      ),
      dataIndex: 'document_date',
      key: 'document_date',
      sorter: true,
      width: 190,
      ellipsis: true,
      render: (_, { document_date }) =>
        document_date ? dayjs(document_date).format('MM-DD-YYYY') : null,
    },
    {
      title: (
        <div>
          <p>Purchase Invoice No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            allowClear
            value={params.document_identity}
            onChange={(e) =>
              dispatch(
                setPurchaseInvoiceListParams({
                  ...params,
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
      width: 180,
      ellipsis: true,
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
            value={params.purchase_order_no}
            onChange={(e) =>
              dispatch(
                setPurchaseInvoiceListParams({
                  ...params,
                  purchase_order_no: e.target.value,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: 'purchase_order_no',
      key: 'purchase_order_no',
      sorter: true,
      width: 180,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Event No</p>
          <AsyncSelect
            endpoint="/event"
            size="small"
            className="w-full font-normal"
            valueKey="event_id"
            labelKey="event_code"
            value={params.event_id}
            onChange={(value) => dispatch(setPurchaseInvoiceListParams({ event_id: value || null }))}
          />
        </div>
      ),
      dataIndex: 'event_code',
      key: 'event_code',
      sorter: true,
      width: 180,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Sales Team</p>
          <AsyncSelect
            endpoint="/sales-team"
            size="small"
            className="w-full font-normal"
            valueKey="sales_team_id"
            labelKey="name"
            mode="multiple"
            value={params.sales_team_ids}
            onChange={(value) => dispatch(setPurchaseInvoiceListParams({ sales_team_ids: value }))}
          />
        </div>
      ),
      dataIndex: 'sales_team_name',
      key: 'sales_team_name',
      sorter: true,
      width: 160,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Vendor</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            allowClear
            value={params.supplier_name}
            onChange={(e) =>
              dispatch(
                setPurchaseInvoiceListParams({
                  ...params,
                  supplier_name: e.target.value,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      sorter: true,
      width: 180,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Vendor Invoice No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            allowClear
            value={params.vendor_invoice_no}
            onChange={(e) =>
              dispatch(
                setPurchaseInvoiceListParams({
                  ...params,
                  vendor_invoice_no: e.target.value,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: 'vendor_invoice_no',
      key: 'vendor_invoice_no',
      sorter: true,
      width: 180,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Charge Order No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            allowClear
            value={params.charge_no}
            onChange={(e) =>
              dispatch(
                setPurchaseInvoiceListParams({
                  ...params,
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
      width: 180,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Ship Via</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            allowClear
            value={params.ship_via}
            onChange={(e) =>
              dispatch(
                setPurchaseInvoiceListParams({
                  ...params,
                  ship_via: e.target.value,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: 'ship_via',
      key: 'ship_via',
      sorter: true,
      width: 180,
      ellipsis: true,
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
      render: (_, { purchase_invoice_id }) => (
        <div className="flex items-center justify-end gap-2">
          {permissions.edit ? (
            <>
              <Tooltip title="Edit">
                <Link to={`/purchase-invoice/edit/${purchase_invoice_id}`}>
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
          {permissions.delete ? (
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure you want to delete?"
                description="After deleting, You will not be able to recover it."
                okButtonProps={{ danger: true }}
                okText="Yes"
                cancelText="No"
                onConfirm={() => onPurchaseInvoiceDelete(purchase_invoice_id)}>
                <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
              </Popconfirm>
            </Tooltip>
          ) : null}
        </div>
      ),
      width: 75,
      fixed: 'right',
    },
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getPurchaseInvoiceList(formattedParams)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.document_date,
    params.customer_id,
    params.event_id,
    params.sales_team_ids,
    params.sales_team_id,
    debouncedSearch,
    debouncedPurchaseInvoiceNo,
    debouncedChargeNo,
    debouncedQuotationNo,
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>PURCHASE INVOICE</PageHeading>
        <Breadcrumb items={[{ title: 'Purchase Invoice' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setPurchaseInvoiceListParams({ search: e.target.value }))}
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
                  dispatch(setPurchaseInvoiceDeleteIDs(selectedRowKeys)),
              }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="purchase_invoice_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} purchase invoice`,
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setPurchaseInvoiceListParams({
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
        title="Are you sure you want to delete these purchase return?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default PurchaseInvoice;
