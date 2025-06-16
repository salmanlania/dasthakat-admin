import { useState, useEffect } from 'react';
import { Modal, Table, Input, Button, Select, Form } from 'antd';
import toast from 'react-hot-toast';
import AsyncSelect from '../AsyncSelect';
import { useSelector, useDispatch } from 'react-redux';
import { stockReturn } from '../../store/features/stockReturnSlice'
import useError from '../../hooks/useError';

const ShipmentReturnModal = ({ visible, onClose, data }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { user } = useSelector((state) => state.auth);
    const permissions = user.permission;
    const handleError = useError();

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (visible) {
            setTableData(
                data.map((row) => ({
                    ...row,
                    quantity: row.quantity || 0,
                    return_quantity: row.quantity || 0,
                    warehouse_id: null
                }))
            );
            form.resetFields();
        } else {
            form.resetFields();
            setTableData([]);
        }
    }, [visible, data]);

    const handleReturn = async () => {
        try {
            await form.validateFields();
            const status = 'created'
            const multiple = true;
            const groupedData = {};
            tableData.forEach((item) => {
                const id = item.picklist_id;
                if (!groupedData[id]) {
                    groupedData[id] = [];
                }
                groupedData[id].push(item);
            });

            const finalData = Object.entries(groupedData).map(([picklist_id, items]) => {
                const stock_return_detail = items.map((item) => ({
                    picklist_detail_id: item.picklist_detail_id,
                    quantity: item.return_quantity,
                    warehouse_id: item.warehouse_id?.value || null
                }));

                return {
                    picklist_id,
                    status,
                    multiple,
                    stock_return_detail
                };
            });

            const payload = {
                stock_returns: [...finalData]
            }

            await dispatch(stockReturn(payload)).unwrap();

            toast.success('Stock Return created successfully');
            onClose();
        } catch (error) {
            handleError(error)
        }
    };

    const columns = [
        {
            title: 'Product Type',
            dataIndex: 'product_type',
            key: 'product_type',
            render: (text, record) => {
                return text || record.product_type_id?.label || 'N/A';
            }
        },
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
            render: (text, record) => {
                return text || record.product_id?.label || 'N/A';
            },
            width: 120
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'PO Quantity',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Received Quantity',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Return Quantity',
            dataIndex: 'return_quantity',
            key: 'quantity',
            render: (_, record, index) => {
                return (
                    <Input
                        min={0}
                        max={record.quantity}
                        value={record.return_quantity}
                        onChange={(e) => {
                            const newValue = parseInt(e.target.value, 10) || 0;
                            setTableData((prev) => {
                                const updated = [...prev];
                                updated[index] = {
                                    ...updated[index],
                                    return_quantity: newValue
                                };
                                return updated;
                            });
                        }}
                    />
                );
            }
        },
        {
            title: 'Warehouse',
            dataIndex: 'warehouse_id',
            key: 'warehouse_id',
            render: (_, { warehouse_id }, index) => {
                return (
                    <Form.Item
                        className="m-0"
                        name={`warehouse_id_${index}`}
                        rules={[
                            {
                                required: true,
                                message: 'Warehouse is required'
                            }
                        ]}>
                        <AsyncSelect
                            endpoint="/warehouse"
                            valueKey="warehouse_id"
                            labelKey="name"
                            labelInValue
                            className="w-full"
                            value={warehouse_id}
                            onChange={(selected) => {
                                setTableData((prev) => {
                                    const updated = [...prev];
                                    updated[index] = {
                                        ...updated[index],
                                        warehouse_id: selected
                                    };
                                    return updated;
                                });
                            }
                            }
                            addNewLink={
                                permissions.warehouse.list && permissions.warehouse.add ? '/warehouse' : null
                            }
                        />
                    </Form.Item>
                );
            },
            width: 200
        },
    ];

    return (
        <Modal
            title="Return Selected Items"
            open={visible}
            onCancel={onClose}
            // width={800}
            width="95%"
            style={{
                maxWidth: '1200px',
                top: 20
            }}
            bodyStyle={{
                padding: '16px 8px',
                maxHeight: '70vh',
                overflow: 'auto'
            }}
            footer={[
                <Button key="cancel" onClick={() => onClose()}>
                    Cancel
                </Button>,
                <Button key="return" type="primary" onClick={handleReturn}>
                    Return
                </Button>
            ]}
        >
            <div style={{ overflowX: 'auto',overflowY: 'auto', maxHeight: 400 }}>
                <Form form={form}>
                    <Table
                        dataSource={tableData}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        style={{ minWidth: '600px' }}
                    />
                </Form>
            </div>
        </Modal>
    );
};

export default ShipmentReturnModal;
