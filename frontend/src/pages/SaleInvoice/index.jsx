import { Breadcrumb, Button, DatePicker, Input, Popconfirm, Select, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegFilePdf } from 'react-icons/fa';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import ChargeOrderModal from '../../components/Modals/ChargeOrderModal';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import {
  getSaleInvoiceList,
  setSaleInvoiceListParams,
  getSaleInvoice
} from '../../store/features/saleInvoiceSlice';
import { createSaleInvoicePrint } from '../../utils/prints/sale-invoice-print';

const SaleInvoice = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.saleInvoice
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
    document_date: params.document_date ? dayjs(params.document_date).format('YYYY-MM-DD') : null
  };

  const onPurchaseInvoiceDelete = async (id) => {
    try {
      // await dispatch(deletePurchaseInvoice(id)).unwrap();
      // toast.success('Purchase order deleted successfully');
      // dispatch(getPurchaseInvoiceList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    closeDeleteModal();
    // try {
    //   await dispatch(bulkDeletePurchaseInvoice(deleteIDs)).unwrap();
    //   toast.success('Purchase invoice deleted successfully');
    //   closeDeleteModal();
    //   await dispatch(getPurchaseInvoiceList(formattedParams)).unwrap();
    // } catch (error) {
    //   handleError(error);
    // }
  };

  const printSaleInvoice = async (id) => {
    const loadingToast = toast.loading('Loading print...');

    try {
      const data = await dispatch(getSaleInvoice(id)).unwrap();
      toast.dismiss(loadingToast);
      createSaleInvoicePrint(data);
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Sale Invoice Date</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              size="small"
              value={params.document_date}
              className="font-normal"
              onChange={(date) => dispatch(setSaleInvoiceListParams({ document_date: date }))}
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
        document_date ? dayjs(document_date).format('MM-DD-YYYY') : null
    },
    {
      title: (
        <div>
          <p>Sale Invoice No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.document_identity}
            onChange={(e) =>
              dispatch(
                setSaleInvoiceListParams({
                  document_identity: e.target.value
                })
              )
            }
          />
        </div>
      ),
      dataIndex: 'document_identity',
      key: 'document_identity',
      sorter: true,
      width: 180,
      ellipsis: true
    },
    {
      title: (
        <div>
          <p>Quoation No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.quotation_no}
            onChange={(e) =>
              dispatch(
                setSaleInvoiceListParams({
                  quotation_no: e.target.value
                })
              )
            }
          />
        </div>
      ),
      dataIndex: 'quotation_no',
      key: 'quotation_no',
      sorter: true,
      width: 180,
      ellipsis: true
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
                setSaleInvoiceListParams({
                  charge_no: e.target.value
                })
              )
            }
          />
        </div>
      ),
      dataIndex: 'charge_no',
      key: 'charge_no',
      sorter: true,
      width: 180,
      ellipsis: true
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      width: 168,
      render: (_, { created_at }) => dayjs(created_at).format('MM-DD-YYYY hh:mm A')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, { sale_invoice_id }) => (
        <div className="flex justify-center items-center gap-2">
          {permissions.edit ? (
            <>
              <Tooltip title="Print">
                <Button
                  size="small"
                  type="primary"
                  className="bg-rose-600 hover:!bg-rose-500"
                  icon={<FaRegFilePdf size={14} />}
                  onClick={() => printSaleInvoice(sale_invoice_id)}
                />
              </Tooltip>
              <Tooltip title="Edit">
                <Link to={`/sale-invoice/edit/${sale_invoice_id}`}>
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
          {/* {permissions.delete ? (
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
          ) : null} */}
        </div>
      ),
      width: 90,
      fixed: 'right'
    }
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    dispatch(getSaleInvoiceList(formattedParams)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.document_date,
    params.customer_id,
    debouncedSearch,
    debouncedPurchaseInvoiceNo,
    debouncedChargeNo,
    debouncedQuotationNo
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>SALE INVOICE</PageHeading>
        <Breadcrumb items={[{ title: 'Sale Invoice' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..." allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setSaleInvoiceListParams({ search: e.target.value }))}
          />

          {/* <div className="flex items-center gap-2">
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
              <Link to="/purchase-invoice/create">
                <Button type="primary">Add New</Button>
              </Link>
            ) : null}
          </div> */}
        </div>

        <Table
          size="small"
          rowSelection={
            permissions.delete
              ? {
                  type: 'checkbox',
                  selectedRowKeys: deleteIDs,
                  onChange: (selectedRowKeys) =>
                    dispatch(setPurchaseInvoiceDeleteIDs(selectedRowKeys))
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
            showTotal: (total) => `Total ${total} sale invoice`
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setSaleInvoiceListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order
              })
            );
          }}
          dataSource={list}
          showSorterTooltip={false}
          columns={columns}
          sticky={{
            offsetHeader: 56
          }}
        />
      </div>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        isDeleting={isBulkDeleting}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these purchase invoice?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default SaleInvoice;
