import { Button, DatePicker, Form, Input, Modal, Table, Tabs } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import useError from '../../hooks/useError';
import {
  getPickListList,
  getPickListListReceives,
  setPickListOpenModalId,
  updatePickListListReceives
} from '../../store/features/pickListSlice';
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
    id: detail.picklist_received_detail_id,
    key: detail.picklist_received_detail_id,
    product: detail?.product?.name || '',
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
  const { params, isPickListReceivesSaving, pickListOpenModalId } = useSelector(
    (state) => state.pickList
  );

  const dataSource = details.map((detail) => ({
    id: detail.picklist_detail_id,
    key: detail.picklist_detail_id,
    product_name: detail?.product_name || '',
    product_id: detail.product_id,
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
      picklist_detail_id: dataSource[index].id,
      product_id: dataSource[index].product_id,
      quantity: detail.remaining_quantity,
      remarks: detail.remarks,
      warehouse_id: detail?.warehouse_id ? detail?.warehouse_id?.value : null
    }));

    const totalQuantity = details.reduce((total, detail) => +total + (+detail.quantity || 0), 0);

    const payload = {
      document_date: dayjs(values.document_date).format('YYYY-MM-DD'),
      total_quantity: totalQuantity,
      picklist_detail: details
    };

    try {
      await dispatch(
        updatePickListListReceives({ id: pickListOpenModalId, data: payload })
      ).unwrap();
      dispatch(setPickListOpenModalId(null));
      toast.success('Picklist receives updated successfully');
      dispatch(getPickListList(params)).unwrap().catch(handleError);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Form
      name="pick-list-receives"
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
          loading={isPickListReceivesSaving}>
          Save
        </Button>
      </div>
    </Form>
  );
};

const PickListReceiveModal = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { pickListOpenModalId, pickListReceives, isPickListReceivesLoading } = useSelector(
    (state) => state.pickList
  );

  const closeModal = () => {
    dispatch(setPickListOpenModalId(null));
  };

  useEffect(() => {
    if (!pickListOpenModalId) {
      return closeModal();
    }

    dispatch(getPickListListReceives(pickListOpenModalId)).unwrap().catch(handleError);
  }, [pickListOpenModalId]);

  return (
    <Modal
      open={pickListOpenModalId}
      onCancel={closeModal}
      loading={isPickListReceivesLoading}
      footer={null}
      width={840}>
      {pickListReceives ? (
        <Tabs
          defaultActiveKey={
            pickListReceives.picklist.length
              ? 'newReceives'
              : pickListReceives.history.length
                ? pickListReceives.history.at(-1).document_identity
                : null
          }
          items={[
            ...pickListReceives.history.map((history) => ({
              label: history.document_date
                ? dayjs(history.document_date).format('MMM-DD-YYYY')
                : dayjs().format('MMM-DD-YYYY'),
              key: history.document_identity,
              children: <HistoryTab details={history.picklist_received_detail || []} />
            }))
          ].concat(
            pickListReceives.picklist.length
              ? [
                  {
                    label: 'New Receives',
                    key: 'newReceives',
                    children: <NewReceivesTab details={pickListReceives.picklist || []} />
                  }
                ]
              : []
          )}
        />
      ) : null}
    </Modal>
  );
};

export default PickListReceiveModal;
