import {
  Breadcrumb,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Popconfirm,
  Spin,
  Table,
  Tooltip
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect/index.jsx';
import PageHeading from '../../components/Heading/PageHeading.jsx';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal.jsx';
import useDebounce from '../../hooks/useDebounce.js';
import useError from '../../hooks/useError.jsx';
import {
  bulkDeleteShipment,
  createShipment,
  deleteShipment,
  getShipmentList,
  setShipmentDeleteIDs,
  setShipmentListParams,
  viewBeforeCreate
} from '../../store/features/shipmentSlice.js';
import { getChargeOrder } from '../../store/features/chargeOrderSlice.js';

const Shipment = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleError = useError();
  const {
    list,
    isListLoading,
    params,
    paginationInfo,
    isBulkDeleting,
    deleteIDs,
    isFormSubmitting
  } = useSelector((state) => state.shipment);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.shipment;
  const otherPermissions = user.permission;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const [createModalIsOpen, setCreateModalIsOpen] = useState(null);

  const [chargeData, setChargeData] = useState(null);
  const [chargeDataGetting, setChargeDataGetting] = useState(false);

  const closeCreateModal = () => {
    setCreateModalIsOpen(null);
    setChargeData(null);
  };

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedCode = useDebounce(params.document_identity, 500);
  const debouncedIMO = useDebounce(params.imo, 500);

  const eventId = Form.useWatch('event_id', form);

  const onShipmentDelete = async (id) => {
    try {
      await dispatch(deleteShipment(id)).unwrap();
      toast.success('Shipment deleted successfully');
      dispatch(getShipmentList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteShipment(deleteIDs)).unwrap();
      toast.success('Shipments deleted successfully');
      closeDeleteModal();
      await dispatch(getShipmentList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const openCreateModal = async () => {
    const isValidForm = await form.validateFields();
    if (!isValidForm) return;

    try {
      setChargeDataGetting(true);
      setCreateModalIsOpen(true);
      const values = form.getFieldsValue();
      const res = await dispatch(
        viewBeforeCreate({
          event_id: values.event_id.value,
          charge_order_id: values?.charge_order_id?.value || null,
          type: 'DO'
        })
      ).unwrap();
      setChargeData(res);
    } catch (error) {
      handleError(error);
    } finally {
      setChargeDataGetting(false);
    }
  };

  const onShipmentCreate = async () => {
    // const isValidForm = await form.validateFields();
    // if (!isValidForm) return;

    // try {
    //   const values = form.getFieldsValue();
    //   await dispatch(
    //     createShipment({
    //       event_id: values.event_id.value,
    //       charge_order_id: values?.charge_order_id?.value || null,
    //       type
    //     })
    //   ).unwrap();
    //   toast.success('Shipment created successfully');
    //   form.resetFields();
    //   dispatch(getShipmentList(params)).unwrap();
    // } catch (error) {
    //   handleError(error);
    // }
    const isValidForm = await form.validateFields();
    if (!isValidForm) return;

    try {
      setChargeDataGetting(true);
      setCreateModalIsOpen(true);
      const values = form.getFieldsValue();
      const res = await dispatch(
        viewBeforeCreate({
          event_id: values.event_id.value,
          charge_order_id: values?.charge_order_id?.value || null,
          type: 'SO'
        })
      ).unwrap();
      setChargeData(res);
    } catch (error) {
      handleError(error);
    } finally {
      setChargeDataGetting(false);
    }
  };

  const onDoShipmentCreate = async () => {
    const filteredChargeData = chargeData
      .map((charge) => ({
        ...charge,
        details: charge.details.filter((detail) => detail.checked) // Keep only checked products
      }))
      .filter((charge) => charge.details.length > 0);

    try {
      const values = form.getFieldsValue();
      await dispatch(
        createShipment({
          event_id: values.event_id.value,
          charge_order_id: values?.charge_order_id?.value || null,
          type: 'DO',
          shipment: filteredChargeData
        })
      ).unwrap();
      toast.success('Shipment created successfully');
      form.resetFields();
      closeCreateModal();
      dispatch(getShipmentList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onChargeOrderChange = async (selected) => {
    form.setFieldsValue({
      event_id: null
    });

    try {
      const res = await dispatch(getChargeOrder(selected.value)).unwrap();
      form.setFieldsValue({
        event_id: res.event
          ? {
              value: res.event.event_id,
              label: res.event.event_code
            }
          : null
      });
    } catch (error) {
      handleError(error);
    }
  };

  const onProductCheck = (chargeId, chargeDetailId) => {  

    const updatedChargeData = chargeData.map((charge) => {
      if (charge.charge_order_id === chargeId) {
        return {
          ...charge,
          details: charge.details.map((detail) => {
            if (detail.charge_order_detail_id === chargeDetailId) {
              return {
                ...detail,
                checked: detail.checked ? false : true
              };
            }
            return detail;
          })
        };
      }
      return charge;
    });

    setChargeData(updatedChargeData); // Assuming setChargeData is your state updater
  };

  const onChargeCheck = (chargeId) => {
    const updatedChargeData = chargeData.map((charge) => {
      if (charge.charge_order_id === chargeId) {
        // Check if all items are already checked
        const allChecked = charge.details.every((detail) => detail.checked);

        return {
          ...charge,
          details: charge.details.map((detail) => ({
            ...detail,
            checked: !allChecked // Toggle all to the opposite state
          }))
        };
      }
      return charge;
    });

    setChargeData(updatedChargeData); // Assuming setChargeData is your state updater
  };

  const isAllChargeChecked = (chargeId) => {
    const charge = chargeData.find((charge) => charge.charge_order_id === chargeId);
    return charge ? charge.details.every((detail) => detail.checked) : false;
  };

  const columns = [
    {
      title: (
        <div>
          <p>Code</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.document_identity}
            onChange={(e) => dispatch(setShipmentListParams({ document_identity: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'document_identity',
      key: 'document_identity',
      sorter: true,
      width: 120,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Event</p>
          <AsyncSelect
            endpoint="/event"
            valueKey="event_id"
            labelKey="event_code"
            size="small"
            className="w-full font-normal"
            value={params.event_id}
            onChange={(value) => dispatch(setShipmentListParams({ event_id: value }))}
          />
        </div>
      ),
      dataIndex: 'event_code',
      key: 'event_code',
      sorter: true,
      width: 150,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Sales Person</p>
          <AsyncSelect
            endpoint="/salesman"
            valueKey="salesman_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.salesman_id}
            onChange={(value) => dispatch(setShipmentListParams({ salesman_id: value }))}
          />
        </div>
      ),
      dataIndex: 'salesman_name',
      key: 'salesman_name',
      sorter: true,
      width: 200,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Vessels</p>
          <AsyncSelect
            endpoint="/vessel"
            valueKey="vessel_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.vessel_id}
            onChange={(value) => dispatch(setShipmentListParams({ vessel_id: value }))}
          />
        </div>
      ),
      sorter: true,
      dataIndex: 'vessel_name',
      key: 'vessel_name',
      width: 220
    },
    {
      title: (
        <div>
          <p>IMO</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.imo}
            onChange={(e) => dispatch(setShipmentListParams({ imo: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'imo',
      key: 'imo',
      sorter: true,
      width: 150,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Flag</p>
          <AsyncSelect
            endpoint="/flag"
            valueKey="flag_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.flag_id}
            onChange={(value) => dispatch(setShipmentListParams({ flag_id: value }))}
          />
        </div>
      ),
      sorter: true,
      dataIndex: 'flag_name',
      key: 'flag_name',
      width: 120
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Class 1</p>
          <AsyncSelect
            endpoint="/class"
            valueKey="class_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.class1_id}
            onChange={(value) => dispatch(setShipmentListParams({ class1_id: value }))}
          />
        </div>
      ),
      sorter: true,
      dataIndex: 'class1_name',
      key: 'class1_name',
      width: 120
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Class 2</p>
          <AsyncSelect
            endpoint="/class"
            valueKey="class_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.class2_id}
            onChange={(value) => dispatch(setShipmentListParams({ class2_id: value }))}
          />
        </div>
      ),
      sorter: true,
      dataIndex: 'class2_name',
      key: 'class2_name',
      width: 120
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      width: 168,
      render: (_, { created_at }) => dayjs(created_at).format('MM-DD-YYYY hh:mm A')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, { shipment_id }) => (
        <div className="flex items-center justify-center gap-2">
          {permissions.edit ? (
            <Tooltip title="Edit">
              <Link to={`/shipment/edit/${shipment_id}`}>
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
                onConfirm={() => onShipmentDelete(shipment_id)}>
                <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
              </Popconfirm>
            </Tooltip>
          ) : null}
        </div>
      ),
      width: 80,
      fixed: 'right'
    }
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    dispatch(getShipmentList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.event_id,
    params.salesman_id,
    params.vessel_id,
    params.flag_id,
    params.class1_id,
    params.class2_id,
    debouncedSearch,
    debouncedCode,
    debouncedIMO
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>SHIPMENT</PageHeading>
        <Breadcrumb items={[{ title: 'Shipment' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-4">
        <Form
          layout="vertical"
          requiredMark="optional"
          name="shipment-list"
          form={form}
          className="mb-2 flex items-end gap-4 rounded-md border border-slate-200 bg-slate-50 p-4">
          <Form.Item name="event_id" className="m-0 w-48" required label="Event">
            <AsyncSelect
              endpoint="/event"
              valueKey="event_id"
              labelKey="event_code"
              labelInValue
              addNewLink={otherPermissions.event.add ? '/event/create' : null}
            />
          </Form.Item>
          <Form.Item name="charge_order_id" label="Charge Order" className="m-0 w-48">
            <AsyncSelect
              endpoint="/charge-order"
              valueKey="charge_order_id"
              labelKey="document_identity"
              labelInValue
              addNewLink={otherPermissions.charge_order.add ? '/charge-order/create' : null}
              onChange={onChargeOrderChange}
            />
          </Form.Item>
          <Button
            type="primary"
            className="mb-[1px] w-28"
            disabled={!eventId}
            loading={isFormSubmitting === 'SO'}
            onClick={() => onShipmentCreate('SO')}>
            Create SO
          </Button>
          <Button
            type="primary"
            className="mb-[1px] w-28"
            disabled={!eventId}
            loading={isFormSubmitting === 'DO'}
            onClick={openCreateModal}>
            Create DO
          </Button>
        </Form>

        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..." allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setShipmentListParams({ search: e.target.value }))}
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
            {/* {permissions.add ? (
              <Link to="/shipment/create">
                <Button type="primary">Add New</Button>
              </Link>
            ) : null} */}
          </div>
        </div>

        <Table
          size="small"
          rowSelection={
            permissions.delete
              ? {
                  type: 'checkbox',
                  selectedRowKeys: deleteIDs,
                  onChange: (selectedRowKeys) => dispatch(setShipmentDeleteIDs(selectedRowKeys))
                }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="shipment_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} shipments`
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setShipmentListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order
              })
            );
          }}
          dataSource={list}
          showSorterTooltip={false}
          columns={columns}
          sticky={{
            offsetHeader: 56
          }}
        />
      </div>

      <Modal open={createModalIsOpen} onCancel={closeCreateModal} footer={null} title="Create DO">
        {chargeDataGetting && (
          <div className="flex justify-center py-24">
            <Spin />
          </div>
        )}

        {!chargeDataGetting && chargeData ? (
          <div className="mt-6">
            {chargeData.map((charge) => (
              <div className="relative rounded border p-2 pt-6" key={charge.charge_order_id}>
                <div
                  className="absolute -top-4 left-2 cursor-pointer rounded border bg-white p-1 px-2"
                  onClick={() => onChargeCheck(charge.charge_order_id)}>
                  <Checkbox checked={isAllChargeChecked(charge.charge_order_id)} />
                  <span className="ml-2">{charge.document_identity}</span>
                </div>

                <div className="flex flex-col gap-2">
                  {charge.details?.map((detail) => (
                    <div
                      className="flex cursor-pointer justify-between rounded border bg-white p-1 px-2"
                      key={detail.charge_order_detail_id}
                      onClick={() =>
                        onProductCheck(charge.charge_order_id, detail.charge_order_detail_id)
                      }>
                      <div>
                        <Checkbox checked={detail.checked ? true : false} />
                        <span className="ml-2">{detail.product_description}</span>
                      </div>
                      <span className="ml-2">{parseFloat(detail?.available_quantity || 0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={closeCreateModal}>Cancel</Button>
              <Button type="primary" onClick={onDoShipmentCreate} loading={isFormSubmitting}>
                Create
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        onDelete={onBulkDelete}
        isDeleting={isBulkDeleting}
        title="Are you sure you want to delete these shipments?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Shipment;
