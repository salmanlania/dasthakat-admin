import { Breadcrumb, Button, DatePicker, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import ChargeOrderModal from '../../components/Modals/ChargeOrderModal';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import useError from '../../hooks/useError';
import {
  bulkDeleteCustomerPaymentSettlement,
  deleteCustomerPaymentSettlement,
  getCustomerPaymentSettlementList,
  setCustomerPaymentSettlementDeleteIDs,
  setCustomerPaymentSettlementListParams,
} from '../../store/features/customerPaymentSettlementSlice.js';

const CustomerPaymentSettlement = () => {
  useDocumentTitle('Customer Payment Settlement List');
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.customerPaymentSettlement,
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.customer_payment;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedQuotationNo = useDebounce(params.document_identity, 500);
  const debouncedCustomerRef = useDebounce(params.remarks, 500);
  const debouncedTotalAmount = useDebounce(params.payment_amount, 500);

  const formattedParams = {
    ...params,
    document_date: params.document_date ? dayjs(params.document_date).format('YYYY-MM-DD') : null,
  };

  const onQuotationDelete = async (id) => {
    try {
      await dispatch(deleteCustomerPaymentSettlement(id)).unwrap();
      toast.success('Customer Payment Settlement deleted successfully');
      dispatch(getCustomerPaymentSettlementList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteCustomerPaymentSettlement(deleteIDs)).unwrap();
      toast.success('Customer Payment Settlements deleted successfully');
      closeDeleteModal();
      await dispatch(getCustomerPaymentSettlementList(formattedParams)).unwrap();
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
      width: 30,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Date</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              size="small"
              value={params.document_date}
              className="font-normal"
              onChange={(date) => dispatch(setCustomerPaymentSettlementListParams({ document_date: date }))}
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
          <p>Document No</p>
          <div onClick={(e) => e.stopPropagation()}>
            <Input
              className="font-normal"
              size="small"
              allowClear
              onClick={(e) => e.stopPropagation()}
              value={params.document_identity}
              onChange={(e) => {
                dispatch(setCustomerPaymentSettlementListParams({ document_identity: e.target.value }));
              }}
            />
          </div>
        </div>
      ),
      dataIndex: 'document_identity',
      key: 'document_identity',
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
            onChange={(value) => dispatch(setCustomerPaymentSettlementListParams({ customer_id: value }))}
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
        <div onClick={(e) => e.stopPropagation()}>
          <p>Payment Amount</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.total_amount}
            onChange={(e) => {
              dispatch(setCustomerPaymentSettlementListParams({ total_amount: e.target.value }));
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
      render: (value) => `${value}.`,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Reference No.</p>
          <Input
            className="font-normal"
            allowClear
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.remarks}
            onChange={(e) => dispatch(setCustomerPaymentSettlementListParams({ remarks: e.target.value }))}
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
      render: (_, { customer_payment_settlement_id }) => (
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-1">
            {permissions.edit ? (
              <Tooltip title="Edit">
                <Link to={`/general-ledger/transactions/customer-payment-settlement/edit/${customer_payment_settlement_id}`}>
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
                  onConfirm={() => onQuotationDelete(customer_payment_settlement_id)}
                >
                  <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
                </Popconfirm>
              </Tooltip>
            ) : null}
          </div>
        </div>
      ),
      width: 70,
      fixed: 'right',
    },
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getCustomerPaymentSettlementList(formattedParams)).unwrap().catch(handleError);
    const savedLimit = sessionStorage.getItem('customerPayments');
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.sales_team_id,
    params.sales_team_ids,
    params.event_code,
    params.document_date,
    params.customer_id,
    params.vessel_id,
    params.event_id,
    params.port_id,
    params.total_amount,
    params.status,
    debouncedSearch,
    debouncedQuotationNo,
    debouncedCustomerRef,
    debouncedTotalAmount,
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CUSTOMER PAYMENT SETTLEMENT</PageHeading>
        <Breadcrumb items={[{ title: 'Customer Payment Settlement' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setCustomerPaymentSettlementListParams({ search: e.target.value }))}
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
              <Link to="/general-ledger/transactions/customer-payment-settlement/create">
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
                  dispatch(setCustomerPaymentSettlementDeleteIDs(selectedRowKeys)),
                getCheckboxProps: (record) => ({
                  disabled: record.isEventHeader,
                }),
              }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey={(record) => record?.customer_payment_settlement_id}
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} customer payments settlements`,
          }}
          onChange={(page, _, sorting) => {
            sessionStorage.setItem('customerPayments', page.pageSize);
            dispatch(
              setCustomerPaymentSettlementListParams({
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
        title="Are you sure you want to delete these customer payments?"
        description="After deleting, you will not be able to recover."
      />

      <ChargeOrderModal />
    </>
  );
};

export default CustomerPaymentSettlement;