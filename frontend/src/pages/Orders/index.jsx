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

const Order = () => {
  useDocumentTitle('Order List');
  const dispatch = useDispatch();
  const handleError = useError();

  const [list, setList] = useState([])

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const onQuotationDelete = async (id) => {
    try {
      toast.success('Order deleted successfully');
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      toast.success('Orders deleted successfully');
      closeDeleteModal();
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
      title: "Date",
      dataIndex: 'document_date',
      key: 'document_date',
      sorter: true,
      width: 150,
      ellipsis: true,
      render: (_, { document_date }) =>
        document_date ? dayjs(document_date).format('MM-DD-YYYY') : null,
    },
    {
      title: "Document No",
      dataIndex: 'document_identity',
      key: 'document_identity',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: "Customer",
      dataIndex: 'customer_name',
      key: 'customer_name',
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: "Payment Amount",
      dataIndex: 'payment_amount',
      key: 'payment_amount',
      sorter: true,
      width: 140,
      ellipsis: true,
      onCell: () => ({
        style: { textAlign: 'right' },
      }),
      render: (value) => `${value}s`,
    },
    {
      title: "Reference No.",
      dataIndex: 'remarks',
      key: 'remarks',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, { customer_payment_id }) => (
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-1">
            <Tooltip title="Edit">
              <Link to={`/general-ledger/transactions/customer-payment/edit/${customer_payment_id}`}>
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
                onConfirm={() => onQuotationDelete(customer_payment_id)}
              >
                <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
              </Popconfirm>
            </Tooltip>
          </div>
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
        <PageHeading>ORDERS</PageHeading>
        <Breadcrumb items={[{ title: 'Order' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
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
            <Link to="/orders/create">
              <Button type="primary">Add New</Button>
            </Link>
          </div>
        </div>

        <Table
          size="small"
          rowSelection={
            {
              type: 'checkbox',
              getCheckboxProps: (record) => ({
                disabled: record.isEventHeader,
              }),
            }
          }
          className="mt-2"
          rowKey={(record) => record.customer_payment_id}
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            // total: paginationInfo.total_records,
            // pageSize: params.limit,
            // current: params.page,
            // showTotal: (total) => `Total ${total} Orders`,
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
        isDeleting={"isBulkDeleting"}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these Orders?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Order;