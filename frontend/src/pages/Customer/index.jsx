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

const Customer = () => {
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
      salesman: "Mark",
      country: "Ukraine",
      address: "Kiev, 2nd Avenue, 14/2, 5th Floor",
      phone_no: "+380999999999",
      email_sales: "Vj4o9@example.com",
      email_accounting: "M8i5v@example.com",
      billing_address: "Kiev, 2nd Avenue, 14/2, 5th Floor",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "2",
      id: "2",
      code: "002",
      name: "Alice Green",
      status: 1,
      salesman: "Lisa",
      country: "USA",
      address: "New York, 5th Avenue, 101",
      phone_no: "+12135551234",
      email_sales: "AliceG@example.com",
      email_accounting: "AliceAcc@example.com",
      billing_address: "New York, 5th Avenue, 101",
      created_at: "02-01-2023 11:00 AM",
    },
    {
      key: "3",
      id: "3",
      code: "003",
      name: "Michael Smith",
      status: 0,
      salesman: "Tom",
      country: "Canada",
      address: "Toronto, Bloor Street, 22",
      phone_no: "+14165557890",
      email_sales: "MichaelS@example.com",
      email_accounting: "MichaelAcc@example.com",
      billing_address: "Toronto, Bloor Street, 22",
      created_at: "03-01-2023 09:30 AM",
    },
    {
      key: "4",
      id: "4",
      code: "004",
      name: "Emma Watson",
      status: 1,
      salesman: "Sophia",
      country: "UK",
      address: "London, Baker Street, 221B",
      phone_no: "+442071234567",
      email_sales: "EmmaW@example.com",
      email_accounting: "EmmaAcc@example.com",
      billing_address: "London, Baker Street, 221B",
      created_at: "04-01-2023 02:00 PM",
    },
    {
      key: "5",
      id: "5",
      code: "005",
      name: "Liam Johnson",
      status: 1,
      salesman: "James",
      country: "Australia",
      address: "Sydney, George Street, 10",
      phone_no: "+61298765432",
      email_sales: "LiamJ@example.com",
      email_accounting: "LiamAcc@example.com",
      billing_address: "Sydney, George Street, 10",
      created_at: "05-01-2023 03:15 PM",
    },
    {
      key: "6",
      id: "6",
      code: "006",
      name: "Olivia Martinez",
      status: 0,
      salesman: "Anna",
      country: "Spain",
      address: "Madrid, Gran Via, 45",
      phone_no: "+34912345678",
      email_sales: "OliviaM@example.com",
      email_accounting: "OliviaAcc@example.com",
      billing_address: "Madrid, Gran Via, 45",
      created_at: "06-01-2023 01:00 PM",
    },
    {
      key: "7",
      id: "7",
      code: "007",
      name: "Noah Davis",
      status: 1,
      salesman: "Liam",
      country: "Germany",
      address: "Berlin, Alexanderplatz, 15",
      phone_no: "+493012345678",
      email_sales: "NoahD@example.com",
      email_accounting: "NoahAcc@example.com",
      billing_address: "Berlin, Alexanderplatz, 15",
      created_at: "07-01-2023 11:45 AM",
    },
    {
      key: "8",
      id: "8",
      code: "008",
      name: "Sophia Wilson",
      status: 1,
      salesman: "Emma",
      country: "France",
      address: "Paris, Champs-Elysees, 8",
      phone_no: "+33123456789",
      email_sales: "SophiaW@example.com",
      email_accounting: "SophiaAcc@example.com",
      billing_address: "Paris, Champs-Elysees, 8",
      created_at: "08-01-2023 10:30 AM",
    },
    {
      key: "9",
      id: "9",
      code: "009",
      name: "James Taylor",
      status: 0,
      salesman: "Michael",
      country: "Italy",
      address: "Rome, Via Veneto, 7",
      phone_no: "+390612345678",
      email_sales: "JamesT@example.com",
      email_accounting: "JamesAcc@example.com",
      billing_address: "Rome, Via Veneto, 7",
      created_at: "09-01-2023 02:45 PM",
    },
    {
      key: "10",
      id: "10",
      code: "010",
      name: "Charlotte Moore",
      status: 1,
      salesman: "Olivia",
      country: "Japan",
      address: "Tokyo, Shibuya, 9-3",
      phone_no: "+81312345678",
      email_sales: "CharlotteM@example.com",
      email_accounting: "CharlotteAcc@example.com",
      billing_address: "Tokyo, Shibuya, 9-3",
      created_at: "10-01-2023 03:30 PM",
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
          <p>Sales Man</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "salesman",
      key: "salesman",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Country</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "country",
      key: "country",
      sorter: true,
      width: 150,
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
      title: (
        <div>
          <p>Phone No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "phone_no",
      key: "phone_no",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Email Sales</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "email_sales",
      key: "email_sales",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Email Accounting</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "email_accounting",
      key: "email_accounting",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Billing Address</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: "billing_address",
      key: "billing_address",
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
            <Link to={`/customer/edit/${id}`}>
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
        <PageHeading>CUSTOMER</PageHeading>
        <Breadcrumb
          items={[{ title: "Customer" }, { title: "List" }]}
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
            <Link to="/customer/create">
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
        title="Are you sure you want to delete these customers?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Customer;
