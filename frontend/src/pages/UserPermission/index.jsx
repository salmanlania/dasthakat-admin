import { Breadcrumb, Button, Table } from "antd";
import { GoTrash } from "react-icons/go";
import { MdOutlineEdit } from "react-icons/md";
import PageHeading from "../../components/heading/PageHeading";

const UserPermission = () => {
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <div className="flex gap-2 items-center">
          <Button
            size="small"
            type="primary"
            className="bg-gray-400 hover:!bg-gray-500"
            icon={<MdOutlineEdit size={14} />}
          />
          <Button
            size="small"
            type="primary"
            danger
            icon={<GoTrash size={14} />}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <PageHeading>USER PERMISSION</PageHeading>
        <Breadcrumb
          items={[{ title: "User Permission" }, { title: "List" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white p-2 rounded-md">
        <div className="flex justify-end">
          <Button type="primary">Add New</Button>
        </div>
        <Table
          size="small"
          className="bg-white mt-2"
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default UserPermission;
