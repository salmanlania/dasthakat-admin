import { Breadcrumb, Button, Input, Select, Table, Tag, Tooltip } from "antd";
import { GoTrash } from "react-icons/go";
import { MdOutlineEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import PageHeading from "../../components/heading/PageHeading";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import { useState } from "react";

const User = () => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const dataSource = [
    {
      key: "1",
      id: "1",
      user_name: "Mike",
      email: "B4t6t@example.com",
      user_permission: "Admin",
      status: 1,
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "2",
      id: "2",
      user_name: "Alice",
      email: "alice@example.com",
      user_permission: "User",
      status: 1,
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "3",
      id: "3",
      user_name: "Bob",
      email: "bob@example.com",
      user_permission: "Moderator",
      status: 0,
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "4",
      id: "4",
      user_name: "Eve",
      email: "eve@example.com",
      user_permission: "User",
      status: 1,
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "5",
      id: "5",
      user_name: "John",
      email: "john.doe@example.com",
      user_permission: "Admin",
      status: 1,
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "6",
      id: "6",
      user_name: "Karen",
      email: "karen@example.com",
      user_permission: "User",
      status: 0,
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "7",
      id: "7",
      user_name: "Steve",
      email: "steve@example.com",
      user_permission: "Moderator",
      status: 1,
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "8",
      id: "8",
      user_name: "Sophia",
      email: "sophia@example.com",
      user_permission: "User",
      status: 1,
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "9",
      id: "9",
      user_name: "Emma",
      email: "emma@example.com",
      user_permission: "User",
      status: 1,
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "10",
      id: "10",
      user_name: "Liam",
      email: "liam@example.com",
      user_permission: "Admin",
      status: 1,
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "11",
      id: "11",
      user_name: "Oliver",
      email: "oliver@example.com",
      user_permission: "User",
      status: 1,
      created_at: "01-02-2023 11:00 AM",
    },
    {
      key: "12",
      id: "12",
      user_name: "Charlotte",
      email: "charlotte@example.com",
      user_permission: "Moderator",
      status: 0,
      created_at: "01-02-2023 11:00 AM",
    },
    {
      key: "13",
      id: "13",
      user_name: "Noah",
      email: "noah@example.com",
      user_permission: "Admin",
      status: 1,
      created_at: "01-03-2023 09:30 AM",
    },
    {
      key: "14",
      id: "14",
      user_name: "Ava",
      email: "ava@example.com",
      user_permission: "User",
      status: 1,
      created_at: "01-03-2023 09:30 AM",
    },
    {
      key: "15",
      id: "15",
      user_name: "James",
      email: "james@example.com",
      user_permission: "Moderator",
      status: 0,
      created_at: "01-04-2023 02:45 PM",
    },
    {
      key: "16",
      id: "16",
      user_name: "Isabella",
      email: "isabella@example.com",
      user_permission: "User",
      status: 1,
      created_at: "01-05-2023 04:00 PM",
    },
    {
      key: "17",
      id: "17",
      user_name: "Elijah",
      email: "elijah@example.com",
      user_permission: "Admin",
      status: 1,
      created_at: "01-06-2023 01:15 PM",
    },
    {
      key: "18",
      id: "18",
      user_name: "Mia",
      email: "mia@example.com",
      user_permission: "User",
      status: 1,
      created_at: "01-07-2023 05:20 PM",
    },
    {
      key: "19",
      id: "19",
      user_name: "Lucas",
      email: "lucas@example.com",
      user_permission: "Moderator",
      status: 0,
      created_at: "01-08-2023 07:00 PM",
    },
    {
      key: "20",
      id: "20",
      user_name: "Harper",
      email: "harper@example.com",
      user_permission: "User",
      status: 1,
      created_at: "01-09-2023 06:10 PM",
    },
    {
      key: "21",
      id: "21",
      user_name: "William",
      email: "william@example.com",
      user_permission: "Admin",
      status: 1,
      created_at: "01-10-2023 10:20 AM",
    },
    {
      key: "22",
      id: "22",
      user_name: "Amelia",
      email: "amelia@example.com",
      user_permission: "User",
      status: 1,
      created_at: "01-11-2023 08:15 AM",
    },
    {
      key: "23",
      id: "23",
      user_name: "Benjamin",
      email: "benjamin@example.com",
      user_permission: "Moderator",
      status: 0,
      created_at: "01-12-2023 11:45 AM",
    },
    {
      key: "24",
      id: "24",
      user_name: "Ella",
      email: "ella@example.com",
      user_permission: "User",
      status: 1,
      created_at: "01-13-2023 09:50 AM",
    },
    {
      key: "25",
      id: "25",
      user_name: "Henry",
      email: "henry@example.com",
      user_permission: "Admin",
      status: 1,
      created_at: "01-14-2023 12:30 PM",
    },
    {
      key: "26",
      id: "26",
      user_name: "Luna",
      email: "luna@example.com",
      user_permission: "User",
      status: 1,
      created_at: "01-15-2023 03:40 PM",
    },
    {
      key: "27",
      id: "27",
      user_name: "Theodore",
      email: "theodore@example.com",
      user_permission: "Moderator",
      status: 0,
      created_at: "01-16-2023 04:10 PM",
    },
    {
      key: "28",
      id: "28",
      user_name: "Scarlett",
      email: "scarlett@example.com",
      user_permission: "User",
      status: 1,
      created_at: "01-17-2023 07:25 PM",
    },
    {
      key: "29",
      id: "29",
      user_name: "Alexander",
      email: "alexander@example.com",
      user_permission: "Admin",
      status: 1,
      created_at: "01-18-2023 08:00 PM",
    },
    {
      key: "30",
      id: "30",
      user_name: "Aria",
      email: "aria@example.com",
      user_permission: "User",
      status: 1,
      created_at: "01-19-2023 09:35 AM",
    },
  ];

  const columns = [
    {
      title: (
        <div>
          <p>User Name</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "user_name",
      key: "user_name",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Email</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "email",
      key: "email",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>User Permission</p>
          <Select
            className="w-full font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            options={[
              {
                value: "Permission 1",
                label: "Permission 1",
              },
              {
                value: "Permission 2",
                label: "Permission 2",
              },
              {
                value: "Permission 3",
                label: "Permission 3",
              },
            ]}
            allowClear
            optionFilterProp="label"
            showSearch
          />
        </div>
      ),
      dataIndex: "user_permission",
      key: "user_permission",
      sorter: true,
      width: 150,
    },
    {
      title: (
        <div>
          <p>Status</p>
          <Select
            className="w-full font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            options={[
              {
                value: 1,
                label: "Active",
              },
              {
                value: 0,
                label: "Inactive",
              },
            ]}
            allowClear
          />
        </div>
      ),
      dataIndex: "status",
      key: "status",
      sorter: true,
      render: (status) =>
        status === 1 ? (
          <Tag color="success" className="w-16 text-center">
            Active
          </Tag>
        ) : (
          <Tag color="error" className="w-16 text-center">
            Inactive
          </Tag>
        ),
      width: 120,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
      width: 155,
    },
    {
      title: "Action",
      key: "action",
      render: (_, { id }) => (
        <div className="flex gap-2 items-center">
          <Tooltip title="Edit">
            <Link to={`/user/edit/${id}`}>
              <Button
                size="small"
                type="primary"
                className="bg-gray-500 hover:!bg-gray-400"
                icon={<MdOutlineEdit size={14} />}
              />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              size="small"
              type="primary"
              danger
              icon={<GoTrash size={14} />}
            />
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
      <div className="flex justify-between items-center">
        <PageHeading>USER</PageHeading>
        <Breadcrumb
          items={[{ title: "User" }, { title: "List" }]}
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
            <Link to="/user/create">
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
        title="Are you sure you want to delete these users?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default User;
