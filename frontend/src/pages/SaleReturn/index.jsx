import { Breadcrumb, Button, DatePicker, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegFilePdf } from 'react-icons/fa';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import AsyncSelect from '../../components/AsyncSelect';

import {
  bulkDeleteSaleReturn,
  getSaleReturnInvoice,
  getSaleReturnList,
  saleReturnDelete,
  setSaleReturnDeleteIDs,
  setSaleReturnListParams,
} from '../../store/features/saleReturnSlice';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import { createSaleReturnPrint } from '../../utils/prints/sale-return-print';

const SaleReturn = () => {
  useDocumentTitle('Credit Note List');
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.saleReturn,
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.sale_return;

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

  const printSaleReturn = async (id) => {
    const loadingToast = toast.loading('Loading print...');

    try {
      const data = await dispatch(getSaleReturnInvoice(id)).unwrap();
      toast.dismiss(loadingToast);
      createSaleReturnPrint(data);
    } catch (error) {
      handleError(error);
    }
  };

  const onSaleReturnDelete = async (id) => {
    try {
      await dispatch(saleReturnDelete(id)).unwrap();
      toast.success('Credit Note deleted successfully');
      dispatch(getSaleReturnList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    closeDeleteModal();
    try {
      await dispatch(bulkDeleteSaleReturn(deleteIDs)).unwrap();
      toast.success('Credit Note deleted successfully');
      closeDeleteModal();
      await dispatch(getSaleReturnList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Credit Note Date</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              size="small"
              value={params.document_date}
              className="font-normal"
              onChange={(date) => dispatch(setSaleReturnListParams({ document_date: date }))}
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
          <p>Credit Note No</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.document_identity}
            onChange={(e) =>
              dispatch(
                setSaleReturnListParams({
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
          <p>Quotation No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.quotation_no}
            onChange={(e) =>
              dispatch(
                setSaleReturnListParams({
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
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.charge_no}
            onChange={(e) =>
              dispatch(
                setSaleReturnListParams({
                  charge_order_no: e.target.value,
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
        <div onClick={(e) => e.stopPropagation()}>
          <p>Event No</p>
          <AsyncSelect
            endpoint="/event"
            size="small"
            className="w-full font-normal"
            valueKey="event_id"
            labelKey="event_code"
            value={params.event_id}
            onChange={(value) => dispatch(setSaleReturnListParams({ event_id: value || null }))}
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
            onChange={(value) => dispatch(setSaleReturnListParams({ sales_team_ids: value }))}
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
      render: (_, { sale_return_id }) => (
        <div className="flex items-center justify-center gap-2">
          {permissions.edit ? (
            <>
              <Tooltip title="Edit">
                <Link to={`/credit-note/edit/${sale_return_id}`}>
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
                    onConfirm={() => onSaleReturnDelete(sale_return_id)}>
                    <Button size="small" type="primary" danger icon={<GoTrash size={16} />} />
                  </Popconfirm>
                </Tooltip>
              ) : null}
              <Tooltip title="Print">
                <Button
                  size="small"
                  type="primary"
                  className="bg-rose-600 hover:!bg-rose-500"
                  icon={<FaRegFilePdf size={16} />}
                  onClick={() => printSaleReturn(sale_return_id)}
                />
              </Tooltip>
            </>
          ) : null}
        </div>
      ),
      width: 90,
      fixed: 'right',
    },
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getSaleReturnList(formattedParams)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.document_date,
    params.event_id,
    params.sales_team_ids,
    params.sales_team_id,
    params.vessel_id,
    debouncedSearch,
    debouncedSaleInvoiceNo,
    debouncedChargeNo,
    debouncedQuotationNo,
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREDIT NOTE</PageHeading>
        <Breadcrumb items={[{ title: 'Credit Note' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setSaleReturnListParams({ search: e.target.value }))}
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
                onChange: (selectedRowKeys) => dispatch(setSaleReturnDeleteIDs(selectedRowKeys)),
              }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="sale_return_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} Credit Note`,
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setSaleReturnListParams({
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
        title="Are you sure you want to delete these Credit Note?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default SaleReturn;
