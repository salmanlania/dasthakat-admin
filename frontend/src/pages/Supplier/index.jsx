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

const Supplier = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, params } = useSelector((state) => state.user);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const dataSource = [
    {
      key: "1",
      id: "1",
      code: "001",
      name: "John Brown",
      status: 1,
      location: "New York, 5th Avenue, 101",
      contact_1: "123-456-7890",
      contact_2: "123-456-7890",
      address: "Kiev, 2nd Avenue, 14/2, 5th Floor",
      email: "Vj4o9@example.com",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "2",
      id: "2",
      code: "002",
      name: "Sarah Smith",
      status: 0,
      location: "Los Angeles, Sunset Blvd, 202",
      contact_1: "987-654-3210",
      contact_2: "987-654-3211",
      address: "Berlin, Alexanderplatz, 3rd Floor",
      email: "sarah.smith@example.com",
      created_at: "02-01-2023 11:00 AM",
    },
    {
      key: "3",
      id: "3",
      code: "003",
      name: "Michael Johnson",
      status: 1,
      location: "Chicago, Michigan Avenue, 303",
      contact_1: "555-123-4567",
      contact_2: "555-123-4568",
      address: "London, Baker Street, 221B",
      email: "m.johnson@example.com",
      created_at: "03-01-2023 12:00 PM",
    },
    {
      key: "4",
      id: "4",
      code: "004",
      name: "Emily Davis",
      status: 1,
      location: "Houston, Main Street, 404",
      contact_1: "444-987-6543",
      contact_2: "444-987-6544",
      address: "Paris, Champs-Élysées, Building 10",
      email: "emily.d@example.com",
      created_at: "04-01-2023 01:00 PM",
    },
    {
      key: "5",
      id: "5",
      code: "005",
      name: "David Wilson",
      status: 0,
      location: "Miami, Ocean Drive, 505",
      contact_1: "222-333-4444",
      contact_2: "222-333-4445",
      address: "Rome, Piazza Venezia, Office 8",
      email: "david.w@example.com",
      created_at: "05-01-2023 02:00 PM",
    },
    {
      key: "6",
      id: "6",
      code: "006",
      name: "Sophia Martinez",
      status: 1,
      location: "San Francisco, Market Street, 606",
      contact_1: "666-777-8888",
      contact_2: "666-777-8889",
      address: "Tokyo, Shibuya, Tower 7",
      email: "s.martinez@example.com",
      created_at: "06-01-2023 03:00 PM",
    },
    {
      key: "7",
      id: "7",
      code: "007",
      name: "James Anderson",
      status: 0,
      location: "Seattle, Pine Street, 707",
      contact_1: "333-444-5555",
      contact_2: "333-444-5556",
      address: "Moscow, Red Square, Building 2",
      email: "j.anderson@example.com",
      created_at: "07-01-2023 04:00 PM",
    },
    {
      key: "8",
      id: "8",
      code: "008",
      name: "Isabella Taylor",
      status: 1,
      location: "Boston, Beacon Street, 808",
      contact_1: "777-888-9999",
      contact_2: "777-888-9990",
      address: "Sydney, George Street, Suite 15",
      email: "isabella.t@example.com",
      created_at: "08-01-2023 05:00 PM",
    },
    {
      key: "9",
      id: "9",
      code: "009",
      name: "Ethan Thomas",
      status: 1,
      location: "Dallas, Elm Street, 909",
      contact_1: "111-222-3333",
      contact_2: "111-222-3334",
      address: "Madrid, Gran Via, Floor 4",
      email: "ethan.t@example.com",
      created_at: "09-01-2023 06:00 PM",
    },
    {
      key: "10",
      id: "10",
      code: "010",
      name: "Olivia Harris",
      status: 0,
      location: "Denver, Broadway, 1010",
      contact_1: "999-000-1111",
      contact_2: "999-000-1112",
      address: "Dubai, Sheikh Zayed Road, Building 5",
      email: "olivia.h@example.com",
      created_at: "10-01-2023 07:00 PM",
    },
  ];

  const columns = [
    {
      title: (
        <div>
          <p>Code</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "code",
      key: "code",
      sorter: true,
      width: 120,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Name</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 200,
      ellipsis: true,
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
      title: (
        <div>
          <p>Location</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "location",
      key: "location",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Contact 1</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "contact_1",
      key: "contact_1",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Contact 2</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "contact_2",
      key: "contact_2",
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
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Address</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "address",
      key: "address",
      sorter: true,
      width: 200,
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
            <Link to={`/supplier/edit/${id}`}>
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
        <PageHeading>SUPPLIER</PageHeading>
        <Breadcrumb
          items={[{ title: "Supplier" }, { title: "List" }]}
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
            <Link to="/supplier/create">
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
        title="Are you sure you want to delete these suppliers?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Supplier;
