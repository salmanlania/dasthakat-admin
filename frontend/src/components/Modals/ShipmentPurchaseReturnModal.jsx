import { useState, useEffect } from 'react';
import { Modal, Table, Input, Button, Select } from 'antd';
import toast from 'react-hot-toast';
import AsyncSelect from '../AsyncSelect';
import { useSelector, useDispatch } from 'react-redux';
import { purchaseReturn } from '../../store/features/purchaseReturnSlice'
import useError from '../../hooks/useError';

const ShipmentPurchaseReturnModal = ({ visible, onClose, data }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const permissions = user.permission;
    const handleError = useError();

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setTableData(
            data.map((row) => ({
                ...row,
                quantity: row.quantity || 0,
                return_quantity: row.quantity || 0,
                status: row.status || 'created'
            }))
        );
    }, [data]);

    const handleReturn = async () => {
        try {
            const status = 'created'
            const multiple = true;
            const groupedData = {};
            tableData.forEach((item) => {
                console.log('order', item)
                const id = item.purchase_order_id;
                if (!groupedData[id]) {
                    groupedData[id] = [];
                }
                groupedData[id].push(item);
            });
            const finalData = Object.entries(groupedData).map(([purchase_order_id, items]) => {
                const purchase_return_detail = items.map((item) => ({
                    purchase_order_detail_id: item.purchase_order_detail_id,
                    quantity: item.return_quantity,
                }));

                return {
                    purchase_order_id,
                    status,
                    multiple,
                    purchase_return_detail
                };
            });

            const payload = {
                purchase_returns: [...finalData]
            }

            await dispatch(purchaseReturn(payload)).unwrap();
            toast.success('Purchase Return created successfully');
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
            }
        },
        {
            title: 'Description',
            dataIndex: 'product_description',
            key: 'product_description'
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
            render: (_, { warehouse_id, product_type_id }, index) => {
                return (
                    <AsyncSelect
                        endpoint="/warehouse"
                        valueKey="warehouse_id"
                        labelKey="name"
                        labelInValue
                        disabled={product_type_id?.value !== 2}
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
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="return" type="primary" onClick={handleReturn}>
                    Return
                </Button>
            ]}
        >
            <div style={{ overflowX: 'auto',overflowY: 'auto', maxHeight: 400 }}>
                <Table
                    dataSource={tableData}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    style={{ minWidth: '600px' }}
                />
            </div>
        </Modal>
    );
};

export default ShipmentPurchaseReturnModal;
