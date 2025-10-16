import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const productsList = [
      {
        product_id: "1",
        product_code: "AB01",
        category: "Abaya",
        brand: "Tahir Qadri Abayas",
        name: "Elegant Black Abaya",
        net_cost_price: 120,
        net_tax_price: 144,
        net_sale_price: 150,
        created_at: "2023-10-01T08:30:00Z",
      },
      {
        product_id: "2",
        product_code: "AB02",
        category: "Abaya",
        brand: "Black Camel",
        name: "Camel Brown Abaya",
        net_cost_price: 110,
        net_tax_price: 132,
        net_sale_price: 140,
        created_at: "2023-10-02T08:30:00Z",
      },
      {
        product_id: "3",
        product_code: "AB03",
        category: "Abaya",
        brand: "Asia Abayas",
        name: "Royal Blue Abaya",
        net_cost_price: 130,
        net_tax_price: 156,
        net_sale_price: 160,
        created_at: "2023-10-03T08:30:00Z",
      },
      {
        product_id: "4",
        product_code: "AB04",
        category: "Abaya",
        brand: "Dasthakat",
        name: "Sleek Black Abaya",
        net_cost_price: 125,
        net_tax_price: 150,
        net_sale_price: 155,
        created_at: "2023-10-04T08:30:00Z",
      },
    ];
    setList(productsList);
  }, []);
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
      title: "Category",
      dataIndex: 'category',
      key: 'category',
      sorter: true,
      width: 160,
    },
    {
      title: "Brand",
      dataIndex: 'brand',
      key: 'brand',
      sorter: true,
      width: 160,
    },
    {
      title: "Name",
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: "Net Cost Price",
      dataIndex: 'net_cost_price',
      key: 'net_cost_price',
      sorter: true,
      width: 150,
      ellipsis: true,
      render: (_, { net_cost_price }) => formatThreeDigitCommas(net_cost_price),
    },
    {
      title: "Tax Price",
      dataIndex: 'net_tax_price',
      key: 'net_tax_price',
      sorter: true,
      width: 150,
      ellipsis: true,
      render: (_, { net_tax_price }) => formatThreeDigitCommas(net_tax_price),
    },
    {
      title: "Net Sale Prices",
      dataIndex: 'net_sale_price',
      key: 'net_sale_price',
      sorter: true,
      width: 150,
      ellipsis: true,
      render: (_, { net_sale_price }) => formatThreeDigitCommas(net_sale_price),
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
              <Button disabled type="primary">Add New</Button>
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
