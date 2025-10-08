import { Breadcrumb, Button, DatePicker, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineTag } from 'react-icons/ai';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect/index.jsx';
import PageHeading from '../../components/Heading/PageHeading.jsx';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal.jsx';
import useDebounce from '../../hooks/useDebounce.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import useError from '../../hooks/useError.jsx';
import {
  bulkDeleteVendorBill,
  deleteVendorBill,
  getVendorBillList,
  resetVendorBillSettlementForm,
  setVendorBillDeleteIDs,
  setVendorBillListParams,
} from '../../store/features/vendorBillSlice.js';
import VendorSettlementTaggingModal from '../../components/Modals/vendorSettlementTaggingModal.jsx';

const VendorBill = () => {
  useDocumentTitle('Vendor Bill List');
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs, balanceAmount } = useSelector(
    (state) => state.vendorBill,
  );

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.payment_voucher;
  const permissionsSettlement = user.permission

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const [taggingModalOpen, setTaggingModalOpen] = useState(false);
  const [vendorBillId, setVendorBillId] = useState(null);
  // const [selectedTotalAmount, setSelectedTotalAmount] = useState(0);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedQuotationNo = useDebounce(params.document_identity, 500);
  const debouncedVoucherRef = useDebounce(params.remarks, 500);
  const debouncedTotalAmount = useDebounce(params.total_amount, 500);
  const debouncedDocumentDate = useDebounce(params.document_date, 500);

  const formattedParams = {
    ...params,
    // document_date: params.document_date ? dayjs(params.document_date).format('YYYY-MM-DD') : null,
  };

  const onQuotationDelete = async (id) => {
    try {
      await dispatch(deleteVendorBill(id)).unwrap();
      toast.success('Vendor Bill deleted successfully');
      dispatch(getVendorBillList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteVendorBill(deleteIDs)).unwrap();
      toast.success('Vendor Bills deleted successfully');
      closeDeleteModal();
      await dispatch(getVendorBillList(formattedParams)).unwrap();
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
              // value={params.document_date}
              value={params.document_date ? dayjs(params.document_date) : null}
              className="font-normal"
              // onChange={(date) => dispatch(setVendorBillListParams({ document_date: date }))}
              onChange={(date) => {
                dispatch(
                  setVendorBillListParams({
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
          <p>Vendor Bill No</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.document_identity}
            onChange={(e) => {
              dispatch(setVendorBillListParams({ document_identity: e.target.value }));
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
          <p>Transaction Account</p>
          <AsyncSelect
            endpoint="/supplier"
            size="small"
            className="w-full font-normal"
            valueKey="supplier_id"
            labelKey="name"
            value={params.supplier_id}
            onChange={(value) => dispatch(setVendorBillListParams({ supplier_id: value }))}
          />
        </div>
      ),
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Total Amount</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.total_amount}
            onChange={(e) => {
              dispatch(setVendorBillListParams({ total_amount: e.target.value }));
            }}
          />
        </div>
      ),
      dataIndex: 'total_amount',
      key: 'total_amount',
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
            allowClear
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.remarks}
            onChange={(e) => dispatch(setVendorBillListParams({ remarks: e.target.value }))}
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
                  <Link to={`/general-ledger/transactions/vendor-bill/edit/${record?.vendor_bill_id}`}>
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
                    onConfirm={() => onQuotationDelete(record?.vendor_bill_id)}
                  >
                    <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
                  </Popconfirm>
                </Tooltip>
              ) : null}
              {permissionsSettlement?.payment_voucher_tagging?.add && balanceAmount > 0 && record?.has_supplier !== 0 ? (
                <Tooltip title="Tagging">
                  <Button
                    size="small"
                    type="primary"
                    icon={<AiOutlineTag size={14} />}
                    onClick={() => {
                      dispatch(resetVendorBillSettlementForm());
                      // setSelectedTotalAmount(record?.total_amount);
                      setVendorBillId(record?.vendor_bill_id);
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
    dispatch(getVendorBillList(formattedParams)).unwrap().catch(handleError);
    const savedLimit = sessionStorage.getItem('vendorBill');
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.sales_team_id,
    params.sales_team_ids,
    params.event_code,
    params.document_date,
    params.voucher_id,
    params.vessel_id,
    params.transaction_account_id,
    params.supplier_id,
    params.event_id,
    params.port_id,
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
        <PageHeading>VENDOR BILL</PageHeading>
        <Breadcrumb items={[{ title: 'Vendor Bill' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setVendorBillListParams({ search: e.target.value }))}
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
              <Link to="/general-ledger/transactions/vendor-bill/create">
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
                  dispatch(setVendorBillDeleteIDs(selectedRowKeys)),
                getCheckboxProps: (record) => ({
                  disabled: record.isEventHeader,
                }),
              }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey={(record) => record.vendor_bill_id}
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} payment vouchers`,
          }}
          onChange={(page, _, sorting) => {
            sessionStorage.setItem('vendorBills', page.pageSize);
            dispatch(
              setVendorBillListParams({
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
        title="Are you sure you want to delete these payment vouchers?"
        description="After deleting, you will not be able to recover."
      />

      {
        <VendorSettlementTaggingModal
          open={taggingModalOpen}
          vendorBillId={vendorBillId}
          // totalAmountValue={selectedTotalAmount}
          onClose={() => {
            setTaggingModalOpen(false)
            dispatch(getVendorBillList(formattedParams))}}
        />
      }
    </>
  );
};

export default VendorBill;