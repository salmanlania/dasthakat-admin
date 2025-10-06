import { Breadcrumb, Button, DatePicker, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';

import {
  bulkDeleteCreditNote,
  clearCreditNoteList,
  creditNoteDelete,
  getCreditNoteList,
  setCreditNoteDeleteIDs,
  setCreditNoteListParams
} from '../../store/features/creditNoteSlice';

import useDocumentTitle from '../../hooks/useDocumentTitle';
// import { createCreditNotePrint } from '../../utils/prints/sale-return-print';

const CreditNote = () => {
  useDocumentTitle('Credit Note List');
  const dispatch = useDispatch();
  const initialLoad = useRef(true)
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.creditNote,
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.credit_note;

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

  const onCreditNoteDelete = async (id) => {
    try {
      await dispatch(creditNoteDelete(id)).unwrap();
      toast.success('Credit Note deleted successfully');
      dispatch(getCreditNoteList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    closeDeleteModal();
    try {
      await dispatch(bulkDeleteCreditNote(deleteIDs)).unwrap();
      toast.success('Credit Note deleted successfully');
      closeDeleteModal();
      await dispatch(getCreditNoteList(formattedParams)).unwrap();
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
              onChange={(date) => dispatch(setCreditNoteListParams({ document_date: date }))}
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
                setCreditNoteListParams({
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
        <div onClick={(e) => e.stopPropagation()}>
          <p>Sale Invoice No</p>
          {/* <AsyncSelect
            // key={`sale_invoice_no_${params.sale_invoice_id}`}
            endpoint="/sale-invoice"
            size="small"
            className="w-full font-normal"
            valueKey="sale_invoice_id"
            labelKey="document_identity"
            value={params.sale_invoice_id}
            onChange={(value) => dispatch(setCreditNoteListParams({ sale_invoice_id: value || null }))}
          /> */}
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.sale_invoice_no}
            onChange={(e) =>
              dispatch(
                setCreditNoteListParams({
                  sale_invoice_no: e.target.value,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: 'sale_invoice_no',
      key: 'sale_invoice_no',
      sorter: true,
      width: 180,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Credit Amount</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.credit_amount}
            onChange={(e) =>
              dispatch(
                setCreditNoteListParams({
                  credit_amount: e.target.value,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: 'credit_amount',
      key: 'credit_amount',
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
            onChange={(value) => dispatch(setCreditNoteListParams({ event_id: value }))}
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
      render: (_, { credit_note_id }) => (
        <div className="flex items-center justify-center gap-2">
          {permissions.edit ? (
            <>
              <Tooltip title="Edit">
                <Link to={`/credit-note/edit/${credit_note_id}`}>
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
                    onConfirm={() => onCreditNoteDelete(credit_note_id)}>
                    <Button size="small" type="primary" danger icon={<GoTrash size={16} />} />
                  </Popconfirm>
                </Tooltip>
              ) : null}
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
    if (initialLoad.current) {
      dispatch(setCreditNoteListParams({
        event_id: null,
        sale_invoice_id: null,
        sale_invoice_no: null,
        document_date: null,
        document_identity: '',
        search: ''
      }));
      initialLoad.current = false;
    }
    // dispatch(clearCreditNoteList());
    dispatch(getCreditNoteList(formattedParams)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.document_date,
    params.event_id,
    params.sale_invoice_id,
    params.sale_invoice_no,
    params.credit_amount,
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
            onChange={(e) => dispatch(setCreditNoteListParams({ search: e.target.value }))}
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
              <Link to="/credit-note/create">
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
                onChange: (selectedRowKeys) => dispatch(setCreditNoteDeleteIDs(selectedRowKeys)),
              }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="credit_note_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} Credit Note`,
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setCreditNoteListParams({
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

export default CreditNote;