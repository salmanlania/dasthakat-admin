import { Breadcrumb, Button, DatePicker, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineTag } from 'react-icons/ai';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PageHeading from '../../components/Heading/PageHeading.jsx';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal.jsx';
import VendorSettlementTaggingModal from '../../components/Modals/vendorSettlementTaggingModal.jsx';
import useDebounce from '../../hooks/useDebounce.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import useError from '../../hooks/useError.jsx';
import {
  bulkDeleteJournalVoucher,
  deleteJournalVoucher,
  getJournalVoucherList,
  resetJournalVoucherSettlementForm,
  setJournalVoucherDeleteIDs,
  setJournalVoucherListParams,
} from '../../store/features/journalVoucherSlice.js';

const JournalVoucher = () => {
  useDocumentTitle('Journal Voucher List');
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs, balanceAmount } = useSelector(
    (state) => state.journalVoucher,
  );

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.journal_voucher;
  const permissionsSettlement = user.permission

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const [taggingModalOpen, setTaggingModalOpen] = useState(false);
  const [journalVoucherId, setJournalVoucherId] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedQuotationNo = useDebounce(params.document_identity, 500);
  const debouncedVoucherRef = useDebounce(params.remarks, 500);
  const debouncedTotalAmount = useDebounce(params.total_amount, 500);
  const debouncedDocumentDate = useDebounce(params.document_date, 500);

  const formattedParams = {
    ...params,
  };

  const onQuotationDelete = async (id) => {
    try {
      await dispatch(deleteJournalVoucher(id)).unwrap();
      toast.success('Journal Voucher deleted successfully');
      dispatch(getJournalVoucherList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteJournalVoucher(deleteIDs)).unwrap();
      toast.success('Journal Vouchers deleted successfully');
      closeDeleteModal();
      await dispatch(getJournalVoucherList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 50,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Date</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              size="small"
              value={params.document_date ? dayjs(params.document_date) : null}
              className="font-normal"
              onChange={(date) => {
                dispatch(
                  setJournalVoucherListParams({
                    document_date: date ? dayjs(date).format("YYYY-MM-DD") : null,
                  })
                );
              }}
              format="MM-DD-YYYY"
            />
          </div>
        </div>
      ),
      dataIndex: 'document_date',
      key: 'document_date',
      sorter: true,
      width: 150,
      ellipsis: true,
      render: (_, { document_date }) =>
        document_date ? dayjs(document_date).format('MM-DD-YYYY') : null,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Journal Voucher No</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.document_identity}
            onChange={(e) => {
              dispatch(setJournalVoucherListParams({ document_identity: e.target.value }));
            }}
          />
        </div>
      ),
      dataIndex: 'document_identity',
      key: 'document_identity',
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Total Debit</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.total_debit}
            onChange={(e) => {
              dispatch(setJournalVoucherListParams({ total_debit: e.target.value }));
            }}
          />
        </div>
      ),
      dataIndex: 'total_debit',
      key: 'total_debit',
      sorter: true,
      width: 140,
      ellipsis: true,
      onCell: () => ({
        style: { textAlign: 'right' },
      }),
      render: (value) => `${value}`,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Total Credit</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.total_credit}
            onChange={(e) => {
              dispatch(setJournalVoucherListParams({ total_credit: e.target.value }));
            }}
          />
        </div>
      ),
      dataIndex: 'total_credit',
      key: 'total_credit',
      sorter: true,
      width: 140,
      ellipsis: true,
      onCell: () => ({
        style: { textAlign: 'right' },
      }),
      render: (value) => `${value}`,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Remarks</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.remarks}
            onChange={(e) => {
              dispatch(setJournalVoucherListParams({ remarks: e.target.value }));
            }}
          />
        </div>
      ),
      dataIndex: 'remarks',
      key: 'remarks',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const balanceAmount = Number(record?.balance_amount);
        return (
          <div className="flex flex-col justify-center gap-1">
            <div className="flex items-center gap-1">
              {permissions.edit ? (
                <Tooltip title="Edit">
                  <Link to={`/general-ledger/transactions/journal-voucher/edit/${record?.journal_voucher_id}`}>
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
                    onConfirm={() => onQuotationDelete(record?.journal_voucher_id)}
                  >
                    <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
                  </Popconfirm>
                </Tooltip>
              ) : null}
              {permissionsSettlement?.journal_voucher_tagging?.add && balanceAmount > 0 && record?.has_supplier !== 0 ? (
                <Tooltip title="Tagging">
                  <Button
                    size="small"
                    type="primary"
                    icon={<AiOutlineTag size={14} />}
                    onClick={() => {
                      dispatch(resetJournalVoucherSettlementForm());
                      setJournalVoucherId(record?.journal_voucher_id);
                      setTaggingModalOpen(true);
                    }}
                  />
                </Tooltip>
              ) : null}
            </div>
          </div>
        )
      },
      width: 90,
      fixed: 'right',
    },
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getJournalVoucherList(formattedParams)).unwrap().catch(handleError);
    const savedLimit = sessionStorage.getItem('journalVoucher');
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.journal_voucher_id,
    params.document_identity,
    params.sort_direction,
    params.document_date,
    params.remarks,
    params.total_debit,
    params.total_credit,
    params.status,
    debouncedSearch,
    debouncedQuotationNo,
    debouncedVoucherRef,
    debouncedTotalAmount,
    debouncedDocumentDate
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>JOURNAL VOUCHER</PageHeading>
        <Breadcrumb items={[{ title: 'Journal Voucher' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setJournalVoucherListParams({ search: e.target.value }))}
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
              <Link to="/general-ledger/transactions/journal-voucher/create">
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
                  dispatch(setJournalVoucherDeleteIDs(selectedRowKeys)),
                getCheckboxProps: (record) => ({
                  disabled: record.isEventHeader,
                }),
              }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey={(record) => record.journal_voucher_id}
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} journal vouchers`,
          }}
          onChange={(page, _, sorting) => {
            sessionStorage.setItem('journalVouchers', page.pageSize);
            dispatch(
              setJournalVoucherListParams({
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
          onRow={(record) => {
            return {
              className: record.isEventHeader ? 'event-header-row' : '',
            };
          }}
        />
      </div>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        isDeleting={isBulkDeleting}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these journal vouchers?"
        description="After deleting, you will not be able to recover."
      />

      {
        <VendorSettlementTaggingModal
          open={taggingModalOpen}
          journalVoucherId={journalVoucherId}
          onClose={() => {
            setTaggingModalOpen(false)
            dispatch(getJournalVoucherList(formattedParams))
          }}
        />
      }
    </>
  );
};

export default JournalVoucher;