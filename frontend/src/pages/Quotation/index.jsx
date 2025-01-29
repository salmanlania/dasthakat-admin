import { Breadcrumb, Button, DatePicker, Input, Popconfirm, Table, Tooltip, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegFilePdf } from 'react-icons/fa';
import { GoTrash } from 'react-icons/go';
import { HiRefresh } from 'react-icons/hi';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/heading/PageHeading';
import ChargeOrderModal from '../../components/Modals/ChargeOrderModal';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import { setChargeQuotationID } from '../../store/features/chargeOrderSlice';
import {
  bulkDeleteQuotation,
  deleteQuotation,
  getQuotationForPrint,
  getQuotationList,
  setQuotationDeleteIDs,
  setQuotationListParams
} from '../../store/features/quotationSlice';
import { createQuotationPrint } from '../../utils/prints/quotation-print';
import { quotationStatusOptions } from '../../components/Form/QuotationForm.jsx';
const Quotation = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.quotation
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.quotation;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedQuotationNo = useDebounce(params.document_identity, 500);

  const formattedParams = {
    ...params,
    document_date: params.document_date ? dayjs(params.document_date).format('YYYY-MM-DD') : null
  };

  const onQuotationDelete = async (id) => {
    try {
      await dispatch(deleteQuotation(id)).unwrap();
      toast.success('Quotation deleted successfully');
      dispatch(getQuotationList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteQuotation(deleteIDs)).unwrap();
      toast.success('Quotations deleted successfully');
      closeDeleteModal();
      await dispatch(getQuotationList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const printQuotation = async (id) => {
    const loadingToast = toast.loading('Loading print...');

    try {
      const data = await dispatch(getQuotationForPrint(id)).unwrap();
      toast.dismiss(loadingToast);
      createQuotationPrint(data);
    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Quotation Date</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              size="small"
              value={params.document_date}
              className="font-normal"
              onChange={(date) => dispatch(setQuotationListParams({ document_date: date }))}
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
        document_date ? dayjs(document_date).format('MM-DD-YYYY') : null
    },
    {
      title: (
        <div>
          <p>Quotation No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.document_identity}
            onChange={(e) =>
              dispatch(setQuotationListParams({ document_identity: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: 'document_identity',
      key: 'document_identity',
      sorter: true,
      width: 150,
      ellipsis: true
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
            onChange={(value) => dispatch(setQuotationListParams({ customer_id: value }))}
          />
        </div>
      ),
      dataIndex: 'customer_name',
      key: 'customer_name',
      sorter: true,
      width: 200,
      ellipsis: true
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
            onChange={(value) => dispatch(setQuotationListParams({ vessel_id: value }))}
          />
        </div>
      ),
      dataIndex: 'vessel_name',
      key: 'vessel_name',
      sorter: true,
      width: 200,
      ellipsis: true
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
            onChange={(value) => dispatch(setQuotationListParams({ event_id: value }))}
          />
        </div>
      ),
      dataIndex: 'event_code',
      key: 'event_code',
      sorter: true,
      width: 140,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Status</p>
          <Select
            size="small"
            className="w-full font-normal"
            allowClear
            options={quotationStatusOptions}
            value={params.status}
            onChange={(value) => dispatch(setQuotationListParams({ status: value }))}
          />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      width: 180,
      ellipsis: true
    },
    {
      title: 'Updated By',
      dataIndex: 'status_updated_by',
      key: 'status_updated_by',
      sorter: true,
      width: 140,
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
      render: (_, { quotation_id }) => (
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-1">
            {permissions.edit ? (
              <Tooltip title="Print">
                <Button
                  size="small"
                  type="primary"
                  className="bg-rose-600 hover:!bg-rose-500"
                  icon={<FaRegFilePdf size={14} />}
                  onClick={() => printQuotation(quotation_id)}
                />
              </Tooltip>
            ) : null}
            <Tooltip title="Charge Order">
              <Button
                size="small"
                type="primary"
                onClick={() => dispatch(setChargeQuotationID(quotation_id))}
                icon={<HiRefresh size={14} />}
              />
            </Tooltip>
          </div>

          <div className="flex items-center gap-1">
            {permissions.edit ? (
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
            ) : null}
            {permissions.delete ? (
              <Tooltip title="Delete">
                <Popconfirm
                  title="Are you sure you want to delete?"
                  description="After deleting, You will not be able to recover it."
                  okButtonProps={{ danger: true }}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => onQuotationDelete(quotation_id)}>
                  <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
                </Popconfirm>
              </Tooltip>
            ) : null}
          </div>
        </div>
      ),
      width: 80,
      fixed: 'right'
    }
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    dispatch(getQuotationList(formattedParams)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.document_date,
    params.customer_id,
    params.vessel_id,
    params.event_id,
    params.status,
    debouncedSearch,
    debouncedQuotationNo
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>QUOTATION</PageHeading>
        <Breadcrumb items={[{ title: 'Quotation' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setQuotationListParams({ search: e.target.value }))}
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
              <Link to="/quotation/create">
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
                  onChange: (selectedRowKeys) => dispatch(setQuotationDeleteIDs(selectedRowKeys))
                }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="quotation_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} quotations`
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setQuotationListParams({
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
        title="Are you sure you want to delete these quotations?"
        description="After deleting, you will not be able to recover."
      />

      <ChargeOrderModal />
    </>
  );
};

export default Quotation;
