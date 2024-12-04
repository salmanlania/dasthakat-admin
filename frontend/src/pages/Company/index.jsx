import {
  Breadcrumb,
  Button,
  Input,
  Popconfirm,
  Select,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { useState } from "react";
import { GoTrash } from "react-icons/go";
import { MdOutlineEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PageHeading from "../../components/heading/PageHeading";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import useError from "../../hooks/useError";

const Company = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, params } = useSelector((state) => state.user);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const dataSource = [
    {
      key: "1",
      id: "1",
      company_name: "Mike",
      default_currency: "USD",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "2",
      id: "2",
      company_name: "Alice",
      default_currency: "USD",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "3",
      id: "3",
      company_name: "Bob",
      default_currency: "USD",
      created_at: "01-01-2023 10:00 AM",
    },
  ];

  const columns = [
    {
      title: (
        <div>
          <p>Company Name</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "company_name",
      key: "company_name",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Default Currency</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "default_currency",
      key: "default_currency",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
      width: 168,
    },
    {
      title: "Action",
      key: "action",
      render: (_, { id }) => (
        <div className="flex gap-2 items-center">
          <Tooltip title="Edit">
            <Link to={`/company/edit/${id}`}>
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
            >
              <Button
                size="small"
                type="primary"
                danger
                icon={<GoTrash size={14} />}
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
      width: 70,
      fixed: "right",
    },
  ];

  const onBulkDelete = () => {
    closeDeleteModal();
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>COMPANY</PageHeading>
        <Breadcrumb
          items={[{ title: "Company" }, { title: "List" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white p-2 rounded-md">
        <div className="flex justify-between items-center gap-2">
          <Input placeholder="Search..." className="w-full sm:w-64" />

          <div className="flex gap-2 items-center">
            <Button
              type="primary"
              danger
              onClick={() => setDeleteModalIsOpen(true)}
            >
              Delete
            </Button>
            <Link to="/company/create">
              <Button type="primary">Add New</Button>
            </Link>
          </div>
        </div>

        <Table
          size="small"
          rowSelection={{
            type: "checkbox",
          }}
          className="mt-2"
          scroll={{ x: "calc(100% - 200px)" }}
          pagination={{
            pageSize: 50,
          }}
          dataSource={dataSource}
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
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these companies?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Company;
