import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import useError from '../../hooks/useError';
import { formatThreeDigitCommas } from '../../utils/number';

const Product = () => {
  useDocumentTitle('Product List');
  const dispatch = useDispatch();
  const handleError = useError();

  const [list, setList] = useState([])

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);


  const onProductDelete = async (id) => {
    try {
      toast.success('Product deleted successfully');
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      toast.success('Products deleted successfully');
      closeDeleteModal();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: 'product_code',
      key: 'product_code',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: "Type",
      dataIndex: 'product_type_name',
      key: 'product_type_name',
      sorter: true,
      width: 160,
    },
    {
      title: "Name",
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: "Short Code",
      dataIndex: 'short_code',
      key: 'short_code',
      sorter: true,
      width: 140,
      ellipsis: true,
    },
    {
      title: "IMPA Code",
      dataIndex: 'impa_code',
      key: 'impa_code',
      sorter: true,
      width: 140,
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: 'category_name',
      key: 'category_name',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: "Sub Category",
      dataIndex: 'sub_category_name',
      key: 'sub_category_name',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: "Brand",
      dataIndex: 'brand_name',
      key: 'brand_name',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: "Unit",
      dataIndex: 'unit_name',
      key: 'unit_name',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: "Cost Price",
      dataIndex: 'cost_price',
      key: 'cost_price',
      sorter: true,
      width: 150,
      ellipsis: true,
      render: (_, { cost_price }) => formatThreeDigitCommas(cost_price),
    },
    {
      title: "Sale Prices",
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
        </div>
      ),
      width: 70,
      fixed: 'right',
    },
  ];

  // if (!permissions.edit && !permissions.delete) {
  //   columns.pop();
  // }

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
            // value={params.search}
          />

          <div className="flex items-center gap-2">
            <Button
              type="primary"
              danger
              onClick={() => setDeleteModalIsOpen(true)}
              disabled
            >
              Delete
            </Button>
            <Link to="/product/create">
              <Button type="primary">Add New</Button>
            </Link>
          </div>
        </div>

        <Table
          size="small"
          rowSelection={
            {
              type: 'checkbox',
            }
          }
          className="mt-2"
          rowKey="product_id"
          scroll={{ x: 'calc(100% - 200px)' }}
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
        isDeleting={"isBulkDeleting"}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these companies?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Product;
