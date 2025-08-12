import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link , useNavigate} from 'react-router-dom';
import AsyncSelect from '../../../components/AsyncSelect';
import PageHeading from '../../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../../hooks/useDebounce';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';
import {
  bulkDeleteSaleInvoice,
  deleteSaleInvoice,
  getSaleInvoice,
  getSaleInvoiceList,
  setSaleInvoiceDeleteIDs,
  setSaleInvoiceListParams,
} from '../../../store/features/saleInvoiceSlice';
import { createSaleInvoicePrint } from '../../../utils/prints/sale-invoice-print';

const CoaLevelOne = () => {
  useDocumentTitle('Chart Of Account Level One List');
  const dispatch = useDispatch();
  const handleError = useError();
  const navigate = useNavigate();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs, listID } =
    useSelector((state) => state.saleInvoice);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.sale_invoice;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedSaleInvoiceNo = useDebounce(params.document_identity, 500);
  const debouncedChargeNo = useDebounce(params.charge_no, 500);
  const debouncedQuotationNo = useDebounce(params.quotation_no, 500);

  const formattedParams = {
    ...params,
    document_date: params.document_date ? dayjs(params.document_date).format('YYYY-MM-DD') : null,
  };

  const onSaleInvoiceDelete = async (id) => {
    try {
      await dispatch(deleteSaleInvoice(id)).unwrap();
      toast.success('Chart Of Account Level One deleted successfully');
      dispatch(getSaleInvoiceList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    closeDeleteModal();
    try {
      await dispatch(bulkDeleteSaleInvoice(deleteIDs)).unwrap();
      toast.success('Chart Of Account Level Ones deleted successfully');
      closeDeleteModal();
      await dispatch(getSaleInvoiceList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
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
          <p>Account Type</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            allowClear
            value={params.document_identity}
            onChange={(e) =>
              dispatch(
                setSaleInvoiceListParams({
                  document_identity: e.target.value || "",
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
        <div onClick={(e) => e.stopPropagation()}>
          <p>Code</p>
          <AsyncSelect
            endpoint="/event"
            size="small"
            className="w-full font-normal"
            valueKey="event_id"
            labelKey="event_code"
            value={params.event_id}
            onChange={(value) => dispatch(setSaleInvoiceListParams({ event_id: value || null }))}
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
          <p>Name</p>
          <AsyncSelect
            endpoint="/vessel"
            size="small"
            className="w-full font-normal"
            valueKey="vessel_id"
            labelKey="name"
            value={params.vessel_id}
            onChange={(value) => dispatch(setSaleInvoiceListParams({ vessel_id: value || null }))}
          />
        </div>
      ),
      dataIndex: 'vessel_name',
      key: 'vessel_name',
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
      title: <div style={{ textAlign: 'center', width: '100%' }}>Action</div>,
      key: 'action',
      render: (_, { sale_invoice_id }) => (
        <div className="flex flex-col justify-center gap-1">
          {permissions.edit ? (
            <>
              <div className="flex items-center gap-1">
                <Tooltip title="Edit">
                  <Link to={`/general-ledger/coa/level1/edit/${sale_invoice_id}`}>
                    <Button
                      size="small"
                      type="primary"
                      className="bg-gray-500 hover:!bg-gray-400"
                      icon={<MdOutlineEdit size={14} />}
                    />
                  </Link>
                </Tooltip>
                {permissions.delete ? (
                  <Tooltip title="Delete">
                    <Popconfirm
                      title="Are you sure you want to delete?"
                      description="After deleting, You will not be able to recover it."
                      okButtonProps={{ danger: true }}
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => onSaleInvoiceDelete(sale_invoice_id)}>
                      <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
                    </Popconfirm>
                  </Tooltip>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      ),
      width: 40,
      fixed: 'right',
    },
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getSaleInvoiceList(formattedParams)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.document_date,
    params.customer_id,
    params.event_id,
    params.vessel_id,
    debouncedSearch,
    debouncedSaleInvoiceNo,
    debouncedChargeNo,
    debouncedQuotationNo,
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>COA LEVEL ONE</PageHeading>
        <Breadcrumb items={[{ title: 'General Ledger' }, { title: 'COA Level One' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setSaleInvoiceListParams({ search: e.target.value || '' }))}
            allowClear
          />
          <div className='flex items-center justify-between gap-2'>
            <div className="flex items-center gap-2">
              {/* {permissions.delete ? ( */}
              <Button
                type="primary"
                onClick={() => navigate('/general-ledger/coa/level1/create')}
              // disabled={!deleteIDs.length}
              >
                Create
              </Button>
              {/* ) : null} */}
            </div>
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
        </div>

        <Table
          size="small"
          rowSelection={
            permissions.delete
              ? {
                type: 'checkbox',
                selectedRowKeys: deleteIDs,
                onChange: (selectedRowKeys) => dispatch(setSaleInvoiceDeleteIDs(selectedRowKeys)),
              }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="sale_invoice_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} coa level one`,
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setSaleInvoiceListParams({
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
        title="Are you sure you want to delete these Sale invoice?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default CoaLevelOne;
