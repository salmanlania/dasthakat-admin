import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect';
import AsyncSelectNoPaginate from '../../components/AsyncSelect/AsyncSelectNoPaginate.jsx';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import useError from '../../hooks/useError';
import {
  bulkDeleteProduct,
  deleteProduct,
  getProductList,
  setProductDeleteIDs,
  setProductListParams,
} from '../../store/features/productSlice';
import { formatThreeDigitCommas, removeCommas } from '../../utils/number';

const Product = () => {
  useDocumentTitle('Product List');
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.product,
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.product;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedCode = useDebounce(params.product_code, 500);
  const debouncedName = useDebounce(params.name, 500);
  const debouncedIMPA = useDebounce(params.impa_code, 500);
  const debouncedSHORTCODE = useDebounce(params.short_code, 500);
  const debouncedCost = useDebounce(params.cost_price, 500);
  const debouncedSale = useDebounce(params.sale_price, 500);

  const formattedParams = {
    ...params,
    cost_price: removeCommas(params.cost_price),
    sale_price: removeCommas(params.sale_price),
  };

  const onProductDelete = async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success('Product deleted successfully');
      dispatch(getProductList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteProduct(deleteIDs)).unwrap();
      toast.success('Products deleted successfully');
      closeDeleteModal();
      await dispatch(getProductList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Code</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.product_code}
            onChange={(e) => dispatch(setProductListParams({ product_code: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'product_code',
      key: 'product_code',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Type</p>
          <AsyncSelectNoPaginate
            endpoint="/lookups/product-types"
            valueKey="product_type_id"
            labelKey="name"
            className="w-full font-normal"
            params={{
              include_other: 0,
            }}
            size="small"
            labelInValue
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.product_type_id}
            onChange={(selected) =>
              dispatch(setProductListParams({ product_type_id: selected ? selected.value : null }))
            }
          />
        </div>
      ),
      dataIndex: 'product_type_name',
      key: 'product_type_name',
      sorter: true,
      width: 160,
    },
    {
      title: (
        <div>
          <p>Name</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.name}
            onChange={(e) => dispatch(setProductListParams({ name: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Short Code</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.short_code}
            onChange={(e) => dispatch(setProductListParams({ short_code: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'short_code',
      key: 'short_code',
      sorter: true,
      width: 140,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>IMPA Code</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.impa_code}
            onChange={(e) => dispatch(setProductListParams({ impa_code: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'impa_code',
      key: 'impa_code',
      sorter: true,
      width: 140,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Category</p>
          <AsyncSelect
            allowClear
            endpoint="/category"
            valueKey="category_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.category_id}
            onChange={(value) => dispatch(setProductListParams({ category_id: value }))}
          />
        </div>
      ),
      dataIndex: 'category_name',
      key: 'category_name',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Sub Category</p>
          <AsyncSelect
            allowClear
            endpoint="/sub-category"
            valueKey="sub_category_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.sub_category_id}
            onChange={(value) => dispatch(setProductListParams({ sub_category_id: value }))}
          />
        </div>
      ),
      dataIndex: 'sub_category_name',
      key: 'sub_category_name',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Brand</p>
          <AsyncSelect
            allowClear
            endpoint="/brand"
            valueKey="brand_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.brand_id}
            onChange={(value) => dispatch(setProductListParams({ brand_id: value }))}
          />
        </div>
      ),
      dataIndex: 'brand_name',
      key: 'brand_name',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Unit</p>
          <AsyncSelect
            allowClear
            endpoint="/unit"
            valueKey="unit_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.unit_id}
            onChange={(value) => dispatch(setProductListParams({ unit_id: value }))}
          />
        </div>
      ),
      dataIndex: 'unit_name',
      key: 'unit_name',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Cost Price</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.cost_price}
            onChange={(e) => dispatch(setProductListParams({ cost_price: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'cost_price',
      key: 'cost_price',
      sorter: true,
      width: 150,
      ellipsis: true,
      render: (_, { cost_price }) => formatThreeDigitCommas(cost_price),
    },
    {
      title: (
        <div>
          <p>Sale Price</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.sale_price}
            onChange={(e) => dispatch(setProductListParams({ sale_price: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'sale_price',
      key: 'sale_price',
      sorter: true,
      width: 150,
      ellipsis: true,
      render: (_, { sale_price }) => formatThreeDigitCommas(sale_price),
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
      title: 'Action',
      key: 'action',
      render: (_, { product_id }) => (
        <div className="flex items-center gap-2">
          {permissions.edit ? (
            <Tooltip title="Edit">
              <Link to={`/product/edit/${product_id}`}>
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
                onConfirm={() => onProductDelete(product_id)}>
                <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
              </Popconfirm>
            </Tooltip>
          ) : null}
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
    dispatch(getProductList(formattedParams)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    debouncedSearch,
    debouncedCode,
    debouncedName,
    debouncedIMPA,
    debouncedSHORTCODE,
    debouncedCost,
    debouncedSale,
    params.product_type_id,
    params.category_id,
    params.sub_category_id,
    params.brand_id,
    params.unit_id,
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>PRODUCT</PageHeading>
        <Breadcrumb items={[{ title: 'Product' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setProductListParams({ search: e.target.value }))}
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
              <Link to="/product/create">
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
                  onChange: (selectedRowKeys) => dispatch(setProductDeleteIDs(selectedRowKeys)),
                }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="product_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} companies`,
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setProductListParams({
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
        title="Are you sure you want to delete these companies?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Product;
