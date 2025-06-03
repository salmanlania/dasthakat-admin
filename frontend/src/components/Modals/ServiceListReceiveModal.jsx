import { Button, DatePicker, Form, Input, Modal, Table, Tabs } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import useError from '../../hooks/useError';
import {
  getServiceListList,
  getServiceListListReceives,
  setServiceListOpenModalId,
  updateServiceListListReceives
} from '../../store/features/serviceListSlice';
import NumberInput from '../Input/NumberInput';
import AsyncSelect from '../AsyncSelect/index.jsx';

const HistoryTab = ({ details }) => {
  const columns = [
    {
      title: 'Sr #',
      dataIndex: 'sr',
      key: 'sr',
      width: 60
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      width: 200
    },
    {
      title: 'Product Description',
      dataIndex: 'product_description',
      key: 'product_description',
      width: 200
    },
    {
      title: 'Quantity',
      dataIndex: 'original_quantity',
      key: 'original_quantity',
      width: 80
    },
    {
      title: 'Received Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 120
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 200
    }
  ];

  const dataSource = details.map((detail) => ({
    id: detail.servicelist_received_detail_id,
    key: detail.servicelist_received_detail_id,
    product: detail?.product?.name || '',
    product_description: detail?.product_description || '',
    original_quantity: parseFloat(detail.original_quantity || 0),
    quantity: parseFloat(detail?.quantity || 0),
    remarks: detail.remarks,
    warehouse: detail?.warehouse?.name || '',
    sr: detail.sort_order + 1
  }));

  return <Table dataSource={dataSource} columns={columns} pagination={false} size="small" />;
};

const NewReceivesTab = ({ details }) => {
  const handleError = useError();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;
  const { params, isServiceListReceivesSaving, serviceListOpenModalId } = useSelector(
    (state) => state.serviceList
  );

  const dataSource = details.map((detail) => ({
    id: detail.servicelist_detail_id,
    key: detail.servicelist_detail_id,
    product_name: detail?.product_name || '',
    product_description: detail?.product_description || '',
    product_id: detail.product_id,
    charge_order_detail_id: detail.charge_order_detail_id,
    remaining_quantity: detail.remaining_quantity ? parseFloat(detail.remaining_quantity) : 0,
    original_quantity: detail.original_quantity ? parseFloat(detail.original_quantity) : 0,
    remarks: detail.remarks
  }));

  const detailColumns = [
    {
      title: 'Sr #',
      dataIndex: 'sr',
      key: 'sr',
      width: 60,
      render: (_, __, index) => `${index + 1}.`
    },
    {
      title: 'Product',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 200,
      render: (_, __, index) => <p>{dataSource[index].product_name}</p>
    },
    {
      title: 'Product Description',
      dataIndex: 'product_description',
      key: 'product_description',
      width: 200,
      render: (_, __, index) => <p>{dataSource[index].product_description}</p>
    },
    {
      title: 'Quantity',
      dataIndex: 'original_quantity',
      key: 'original_quantity',
      width: 80,
      render: (_, __, index) => <p>{parseFloat(dataSource[index]?.original_quantity || 0)}</p>
    },
    {
      title: 'Remaining Quantity',
      dataIndex: 'remaining_quantity',
      key: 'remaining_quantity',
      width: 80,
      render: (_, __, index) => (
        <Form.Item
          name={[index, 'remaining_quantity']}
          validateFirst
          rules={[
            { required: true, message: 'Remaining Quantity required' },
            {
              validator: (_, value) => {
                if (value > dataSource[index].remaining_quantity) {
                  return Promise.reject(
                    `Remaining Quantity cannot be greater than ${dataSource[index].remaining_quantity}`
                  );
                }
                return Promise.resolve();
              }
            }
          ]}
          className="m-0">
          <NumberInput />
        </Form.Item>
      )
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse_id',
      key: 'warehouse_id',
      width: 200,
      render: (_, __, index) => (
        <Form.Item
          name={[index, 'warehouse_id']}
          className="m-0">
          <AsyncSelect
            endpoint="/warehouse"
            valueKey="warehouse_id"
            labelKey="name"
            labelInValue
            className="w-full"
            addNewLink={
              permissions.warehouse.list && permissions.warehouse.add ? '/warehouse' : null
            }
          />
        </Form.Item>
      )
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 200,
      render: (_, __, index) => (
        <Form.Item
          name={[index, 'remarks']}
          className="m-0">
          <Input />
        </Form.Item>
      )
    }
  ];

  const onSubmit = async (values) => {
    const details = values.details.map((detail, index) => ({
      servicelist_detail_id: dataSource[index].id,
      product_id: dataSource[index].product_id,
      quantity: detail.remaining_quantity,
      remarks: detail.remarks,
      charge_order_detail_id: dataSource[index].charge_order_detail_id,
      warehouse_id: detail?.warehouse_id ? detail?.warehouse_id?.value : null
    }));

    const totalQuantity = details.reduce((total, detail) => +total + (+detail.quantity || 0), 0);

    const payload = {
      document_date: dayjs(values.document_date).format('YYYY-MM-DD'),
      total_quantity: totalQuantity,
      servicelist_detail: details
    };

    try {
      await dispatch(
        updateServiceListListReceives({ id: serviceListOpenModalId, data: payload })
      ).unwrap();
      dispatch(setServiceListOpenModalId(null));
      toast.success('Service list receives updated successfully');
      dispatch(getServiceListList(params)).unwrap().catch(handleError);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Form
      name="service-list-receives"
      form={form}
      layout="vertical"
      autoComplete="off"
      initialValues={{
        document_date: dayjs(),
        details: dataSource
      }}
      onFinish={onSubmit}>
      <Form.Item
        name="document_date"
        label="Receive Date"
        rules={[
          {
            required: true,
            message: 'Receive Date is required!'
          }
        ]}>
        <DatePicker format="MM-DD-YYYY" />
      </Form.Item>

      <Form.List name="details">
        {(fields) => (
          <Table
            dataSource={fields}
            columns={detailColumns}
            size="small"
            pagination={false}
            rowKey="key"
          />
        )}
      </Form.List>

      <div className="mt-4 flex items-center justify-end">
        <Button
          type="primary"
          className="w-28"
          onClick={() => form.submit()}
          loading={isServiceListReceivesSaving}>
          Save
        </Button>
      </div>
    </Form>
  );
};

const ServiceListReceiveModal = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { serviceListOpenModalId, serviceListReceives, isServiceListReceivesLoading } = useSelector(
    (state) => state.serviceList
  );

  const closeModal = () => {
    dispatch(setServiceListOpenModalId(null));
  };

  useEffect(() => {
    if (!serviceListOpenModalId) {
      return closeModal();
    }

    dispatch(getServiceListListReceives(serviceListOpenModalId)).unwrap().catch(handleError);
  }, [serviceListOpenModalId]);

  return (
    <Modal
      open={serviceListOpenModalId}
      onCancel={closeModal}
      loading={isServiceListReceivesLoading}
      footer={null}
      width={840}>
      {serviceListReceives ? (
        <Tabs
          defaultActiveKey={
            serviceListReceives.servicelist.length
              ? 'newReceives'
              : serviceListReceives.history.length
                ? serviceListReceives.history.at(-1).document_identity
                : null
          }
          items={[
            ...serviceListReceives.history.map((history) => ({
              label: history.document_date
                ? dayjs(history.document_date).format('MMM-DD-YYYY')
                : dayjs().format('MMM-DD-YYYY'),
              key: history.document_identity,
              children: <HistoryTab details={history.servicelist_received_detail || []} />
            }))
          ].concat(
            serviceListReceives.servicelist.length
              ? [
                  {
                    label: 'New Receives',
                    key: 'newReceives',
                    children: <NewReceivesTab details={serviceListReceives.servicelist || []} />
                  }
                ]
              : []
          )}
        />
      ) : null}
    </Modal>
  );
};

export default ServiceListReceiveModal;
