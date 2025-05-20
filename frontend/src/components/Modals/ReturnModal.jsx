import { useState, useEffect } from 'react';
import { Modal, Table, Input, Button } from 'antd';
import toast from 'react-hot-toast';
import AsyncSelect from '../AsyncSelect';
import { useSelector, useDispatch } from 'react-redux';
import { returnSaleInvoice } from '../../store/features/saleReturnSlice'
import useError from '../../hooks/useError';

const ReturnModal = ({ visible, onClose, data }) => {
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
            }))
        );
    }, [data]);

    const handleReturn = async () => {
        try {
            const picklist_id = tableData[0]?.picklist_id || null;

            const sale_return_detail = tableData.map((item, index) => {
                const detail = {
                    picklist_detail_id: item.id,
                    quantity: item.return_quantity,
                    warehouse_id: item.warehouse_id?.value ? item.warehouse_id?.value : null
                };

                return detail;
            });
            const data = {
                picklist_id,
                sale_return_detail
            }
            await dispatch(returnSaleInvoice(data)).unwrap();
            toast.success('Sale Return created successfully');
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
            render: (_, { warehouse_id }, index) => {
                return (
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
            width={800}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="return" type="primary" onClick={handleReturn}>
                    Return
                </Button>
            ]}
        >
            <Table
                dataSource={tableData}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="small"
            />
        </Modal>
    );
};

export default ReturnModal;
