import { Breadcrumb, Button, DatePicker, Input, Popconfirm, Table, Tooltip, Upload } from 'antd';
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
import ImportOpeningStockModal from '../../components/Modals/ImportOpeningStockModal';
import {
  bulkDeleteOpeningStock,
  createOpeningStock,
  deleteOpeningStock,
  getOpeningStockForPrint,
  getOpeningStockList,
  setOpeningStockDeleteIDs,
  setOpeningStockListParams
} from '../../store/features/openingStockSlice';
import { getPurchaseOrder } from '../../store/features/purchaseOrderSlice';
import { createOpeningStockPrint } from '../../utils/prints/opening-stock-print';

const OpeningStock = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.openingStock
  );
  const { user } = useSelector((state) => state.auth);
  const otherPermissions = user.permission;
  const permissions = user.permission.opening_stock;
  const currency = user.currency;

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const [selectedPO, setSelectedPO] = useState(null);
  const [isGRNCreating, setIsGRNCreating] = useState(false);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedOpeningStockNo = useDebounce(params.document_identity, 500);

  const formattedParams = {
    ...params,
    document_date: params.document_date ? dayjs(params.document_date).format('YYYY-MM-DD') : null
  };

  const onOpeningStockDelete = async (id) => {
    try {
      await dispatch(deleteOpeningStock(id)).unwrap();
      toast.success('Opening Stock deleted successfully');
      dispatch(getOpeningStockList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteOpeningStock(deleteIDs)).unwrap();
      toast.success('Opening Stocks deleted successfully');
      closeDeleteModal();
      await dispatch(getOpeningStockList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const printOpeningStock = async (id) => {
    const loadingToast = toast.loading('Loading print...');

    try {
      const data = await dispatch(getOpeningStockForPrint(id)).unwrap();
      toast.dismiss(loadingToast);
      createOpeningStockPrint(data);
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

      const details = purchase_order_detail
        .map((detail, index) => ({
          id: detail.purchase_order_detail_id,
          purchase_order_detail_id: detail.purchase_order_detail_id,
          product_type_id: detail.product_type ? detail.product_type.product_type_id : null,
          product_code: detail.product ? detail.product.product_code : null,
          product_id: detail.product ? detail.product.product_id : null,
          warehouse_id: null,
          product_name: detail.product_name,
          product_description: detail.product_description,
          description: detail.description,
          quantity: detail?.available_quantity ? parseFloat(detail?.available_quantity) : 0,
          unit_id: detail.unit ? detail.unit.unit_id : null,
          sort_order: index
        }))
        .filter((detail) => detail.quantity > 0);

      const totalQuantity = details.reduce((total, detail) => total + detail.quantity, 0);
      const payload = {
        default_currency_id: currency ? currency.currency_id : null,
        document_date: dayjs().format('YYYY-MM-DD'),
        purchase_order_id: selectedPO,
        supplier_id: supplier?.supplier_id,
        good_received_note_detail: details,
        total_quantity: totalQuantity
      };

      await dispatch(createOpeningStock(payload)).unwrap();
      toast.success('Opening Stock created successfully');
      setSelectedPO(null);

      dispatch(getOpeningStockList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    } finally {
      setIsGRNCreating(false);
    }
  };

  const handleImportSubmit = ({ file, remarks }) => {
    if (!file) return toast.error('Please upload a file');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('remarks', remarks);

    toast.success('File prepared for upload');
  };

  const columns = [
    {
      title: (
        <div>
          <p>Opening Stock Date</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              size="small"
              value={params.document_date}
              className="font-normal"
              onChange={(date) => dispatch(setOpeningStockListParams({ document_date: date }))}
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
          <p>Opening Stock No</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.document_identity}
            onChange={(e) =>
              dispatch(
                setOpeningStockListParams({
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
      title: 'Total Quantity',
      dataIndex: 'total_quantity',
      key: 'total_quantity',
      width: 140
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 140
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 140
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
      render: (_, { opening_stock_id }) => {
        return (
          <div className="flex items-center gap-2">
            {permissions.edit ? (
              <>
                <Tooltip title="Edit">
                  <Link to={`/opening-stock/edit/${opening_stock_id}`}>
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
                  onConfirm={() => onOpeningStockDelete(opening_stock_id)}
                >
                  <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
                </Popconfirm>
              </Tooltip>
            ) : null}
          </div>
        )
      },
      width: 90,
      fixed: 'right'
    }
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getOpeningStockList(formattedParams)).unwrap().catch(handleError);
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
    debouncedOpeningStockNo
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>OPENING STOCK</PageHeading>
        <Breadcrumb items={[{ title: 'Opening Stock' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setOpeningStockListParams({ search: e.target.value }))}
          />

          <div className="ml-auto flex flex-wrap items-center gap-2">
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
              <Link to="/opening-stock/create">
                <Button type="primary">Add New</Button>
              </Link>
            ) : null}
            {permissions.add ? (
              <Button
                type="primary"
                className="bg-blue-500 hover:!bg-blue-600 border-none"
                onClick={() => setImportModalOpen(true)}
              >
                Import
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
                  dispatch(setOpeningStockDeleteIDs(selectedRowKeys))
              }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="opening_stock_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} opening stock`
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setOpeningStockListParams({
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
        title="Are you sure you want to delete these Opening Stock?"
        description="After deleting, you will not be able to recover."
      />

      <ChargeOrderModal />
      <ImportOpeningStockModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onUpload={handleImportSubmit}
      />
    </>
  );
};

export default OpeningStock;
