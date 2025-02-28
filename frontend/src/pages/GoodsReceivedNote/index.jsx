import { Breadcrumb, Button, DatePicker, Input, Popconfirm, Table, Tooltip } from 'antd';
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
  bulkDeleteGoodsReceivedNote,
  createGoodsReceivedNote,
  deleteGoodsReceivedNote,
  getGoodsReceivedNoteForPrint,
  getGoodsReceivedNoteList,
  setGoodsReceivedNoteDeleteIDs,
  setGoodsReceivedNoteListParams
} from '../../store/features/goodsReceivedNoteSlice';
import { getPurchaseOrder } from '../../store/features/purchaseOrderSlice';
import { createGoodsReceivedNotePrint } from '../../utils/prints/goods-received-note-print';

const GoodsReceivedNote = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.goodsReceivedNote
  );
  const { user } = useSelector((state) => state.auth);
  const otherPermissions = user.permission;
  const permissions = user.permission.good_received_note;
  const currency = user.currency;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const [selectedPO, setSelectedPO] = useState(null);
  const [isGRNCreating, setIsGRNCreating] = useState(false);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedGoodsReceivedNoteNo = useDebounce(params.document_identity, 500);

  const formattedParams = {
    ...params,
    document_date: params.document_date ? dayjs(params.document_date).format('YYYY-MM-DD') : null
  };

  const onGoodsReceivedNoteDelete = async (id) => {
    try {
      await dispatch(deleteGoodsReceivedNote(id)).unwrap();
      toast.success('Goods Received Note deleted successfully');
      dispatch(getGoodsReceivedNoteList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteGoodsReceivedNote(deleteIDs)).unwrap();
      toast.success('Goods Received Notes deleted successfully');
      closeDeleteModal();
      await dispatch(getGoodsReceivedNoteList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const printGoodsReceivedNote = async (id) => {
    const loadingToast = toast.loading('Loading print...');

    try {
      const data = await dispatch(getGoodsReceivedNoteForPrint(id)).unwrap();
      toast.dismiss(loadingToast);
      createGoodsReceivedNotePrint(data);
    } catch (error) {
      handleError(error);
    }
  };

  const onGRNCreate = async () => {
    try {
      setIsGRNCreating(true);
      const { purchase_order_detail, supplier } = await dispatch(
        getPurchaseOrder(selectedPO)
      ).unwrap();

      const details = purchase_order_detail.map((detail, index) => ({
        id: detail.purchase_order_detail_id,
        product_type_id: detail.product_type ? detail.product_type.product_type_id : null,
        product_code: detail.product ? detail.product.product_code : null,
        product_id: detail.product ? detail.product.product_id : null,
        product_name: detail.product_name,
        description: detail.description,
        quantity: detail.quantity ? parseFloat(detail.quantity) : 0,
        unit_id: detail.unit ? detail.unit.unit_id : null,
        sort_order: index
      }));

      const totalQuantity = details.reduce((total, detail) => total + detail.quantity, 0);
      const payload = {
        default_currency_id: currency ? currency.currency_id : null,
        document_date: dayjs().format('YYYY-MM-DD'),
        purchase_order_id: selectedPO,
        supplier_id: supplier.supplier_id,
        good_received_note_detail: details,
        total_quantity: totalQuantity
      };

      await dispatch(createGoodsReceivedNote(payload)).unwrap();
      toast.success('Goods Received Note created successfully');
      setSelectedPO(null);

      dispatch(getGoodsReceivedNoteList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    } finally {
      setIsGRNCreating(false);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>GRN Date</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              size="small"
              value={params.document_date}
              className="font-normal"
              onChange={(date) => dispatch(setGoodsReceivedNoteListParams({ document_date: date }))}
              format="MM-DD-YYYY"
            />
          </div>
        </div>
      ),
      dataIndex: 'document_date',
      key: 'document_date',
      sorter: true,
      width: 160,
      ellipsis: true,
      render: (_, { document_date }) =>
        document_date ? dayjs(document_date).format('MM-DD-YYYY') : null
    },
    {
      title: (
        <div>
          <p>GRN No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.document_identity}
            onChange={(e) =>
              dispatch(
                setGoodsReceivedNoteListParams({
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
      width: 160,
      ellipsis: true
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
            onChange={(value) => dispatch(setGoodsReceivedNoteListParams({ supplier_id: value }))}
          />
        </div>
      ),
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      sorter: true,
      width: 200,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Purchase Order</p>
          <AsyncSelect
            endpoint="/purchase-order"
            size="small"
            className="w-full font-normal"
            valueKey="purchase_order_id"
            labelKey="document_identity"
            value={params.purchase_order_id}
            onChange={(value) =>
              dispatch(setGoodsReceivedNoteListParams({ purchase_order_id: value }))
            }
          />
        </div>
      ),
      dataIndex: 'purchase_order_no',
      key: 'purchase_order_no',
      sorter: true,
      width: 200,
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
      render: (_, { good_received_note_id }) => (
        <div className="flex items-center gap-2">
          {permissions.edit ? (
            <>
              <Tooltip title="Print">
                <Button
                  size="small"
                  type="primary"
                  className="bg-rose-600 hover:!bg-rose-500"
                  icon={<FaRegFilePdf size={14} />}
                  // onClick={() => printGoodsReceivedNote(purchase_order_id)}
                />
              </Tooltip>
              <Tooltip title="Edit">
                <Link to={`/goods-received-note/edit/${good_received_note_id}`}>
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
                onConfirm={() => onGoodsReceivedNoteDelete(good_received_note_id)}>
                <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
              </Popconfirm>
            </Tooltip>
          ) : null}
        </div>
      ),
      width: 105,
      fixed: 'right'
    }
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    dispatch(getGoodsReceivedNoteList(formattedParams)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.document_date,
    params.customer_id,
    params.supplier_id,
    params.purchase_order_id,
    debouncedSearch,
    debouncedGoodsReceivedNoteNo
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>GOODS RECEIVED NOTE</PageHeading>
        <Breadcrumb items={[{ title: 'Goods Received Note' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setGoodsReceivedNoteListParams({ search: e.target.value }))}
          />

          <div className="ml-auto flex flex-wrap items-center gap-2">
            {permissions.add ? (
              <>
                <AsyncSelect
                  endpoint="/purchase-order"
                  valueKey="purchase_order_id"
                  labelKey="document_identity"
                  className="min-w-40"
                  placeholder="Purchase Order"
                  params={{
                    available_po: 1
                  }}
                  value={selectedPO}
                  onChange={(selected) => setSelectedPO(selected)}
                  addNewLink={
                    otherPermissions.purchase_order.list && otherPermissions.purchase_order.add
                      ? '/purchase-order/create'
                      : null
                  }
                />
                <Button
                  type="primary"
                  onClick={onGRNCreate}
                  disabled={!selectedPO}
                  loading={isGRNCreating}>
                  Create GRN
                </Button>
              </>
            ) : null}
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
              <Link to="/goods-received-note/create">
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
                    dispatch(setGoodsReceivedNoteDeleteIDs(selectedRowKeys))
                }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="good_received_note_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} goods received note`
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setGoodsReceivedNoteListParams({
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
        title="Are you sure you want to delete these goods received notes?"
        description="After deleting, you will not be able to recover."
      />

      <ChargeOrderModal />
    </>
  );
};

export default GoodsReceivedNote;
