import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from "antd";
import { useState } from "react";
import { GoTrash } from "react-icons/go";
import { MdOutlineEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import PageHeading from "../../components/heading/PageHeading";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import useError from "../../hooks/useError";
import {
  addNewPayment,
  removeNewPayment,
  setPaymentDeleteIDs,
  setPaymentEditable,
} from "../../store/features/paymentSlice";

const Payment = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, params, deleteIDs } = useSelector((state) => state.payment);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const onSubmit = (id, value, prevValue) => {
    if (id === "new") {
      return dispatch(removeNewPayment());
    }

    // if (value === prevValue || !value) {
    //   return dispatch(setPaymentEditable({ key: id, editable: false }));
    // }

    return dispatch(setPaymentEditable({ key: id, editable: false }));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 120,
      ellipsis: true,
      render: (_, { name, editable, payment_id }) =>
        editable ? (
          <Input
            autoFocus
            defaultValue={name}
            onPressEnter={(e) => onSubmit(payment_id, e.target.value, name)}
            onBlur={(e) => onSubmit(payment_id, e.target.value, name)}
          />
        ) : (
          <span>{name}</span>
        ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
      width: 168,
      render: (_, { created_at }) =>
        created_at ? (
          <span>{created_at}</span>
        ) : (
          <span className="text-gray-400">AUTO</span>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, { payment_id }) => (
        <div className="flex gap-2 items-center">
          <Tooltip title="Edit">
            <Button
              size="small"
              type="primary"
              className="bg-gray-500 hover:!bg-gray-400"
              icon={<MdOutlineEdit size={14} />}
              onClick={() =>
                dispatch(
                  setPaymentEditable({
                    key: payment_id,
                    editable: true,
                  })
                )
              }
            />
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
        <PageHeading>PAYMENT</PageHeading>
        <Breadcrumb
          items={[{ title: "Payment" }, { title: "List" }]}
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
              disabled={!deleteIDs.length}
            >
              Delete
            </Button>
            <Button type="primary" onClick={() => dispatch(addNewPayment())}>
              Add New
            </Button>
          </div>
        </div>

        <Table
          size="small"
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: deleteIDs,
            onChange: (selectedRowKeys) =>
              dispatch(setPaymentDeleteIDs(selectedRowKeys)),
          }}
          className="mt-2"
          scroll={{ x: "calc(100% - 200px)" }}
          pagination={{
            pageSize: 50,
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
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these payments?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Payment;
