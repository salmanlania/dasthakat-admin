import { useState, useEffect } from 'react';
import { Modal, Table, Input, Button, Select, Form } from 'antd';
import toast from 'react-hot-toast';
import AsyncSelect from '../AsyncSelect';
import { useSelector, useDispatch } from 'react-redux';
import { returnSaleInvoice } from '../../store/features/saleReturnSlice'
import { returnStockReturn } from '../../store/features/stockReturnSlice'
import { returnPurchaseOrder } from '../../store/features/purchaseReturnSlice'
import useError from '../../hooks/useError';

const ReturnModal = ({ visible, onClose, data, onRefresh }) => {
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
            const type_id = tableData.map(item => item?.product_type_id?.value ?? null);
            const sale_invoice_id = tableData[0]?.sale_invoice_id || null;
            const sale_return_detail = tableData.map((item) => {
                const detail = {
                    sale_invoice_detail_id: item.sale_invoice_detail_id,
                    quantity: item.return_quantity,
                    warehouse_id: item.warehouse_id?.value ? item.warehouse_id?.value : null,
                };
                return detail;
            });

            const picklistItem = tableData.find(item => item.picklist_id);
            const picklist_id = picklistItem?.picklist_id || null;
            const status = 'created'
            // stock
            const stock_return_detail = tableData.map((item) => {
                const detail = {
                    picklist_detail_id: item.picklist_detail_id,
                    quantity: item.return_quantity,
                    warehouse_id: item.warehouse_id?.value ? item.warehouse_id?.value : null,
                };
                return detail;
            });

            // purchase
            const purchase_order_id = tableData[0]?.purchase_order_id || null;
            const purchase_return_detail = tableData.map((item) => {
                const detail = {
                    purchase_order_detail_id: item.purchase_order_detail_id,
                    quantity: item.return_quantity,
                    warehouse_id: item?.product_type_id?.value === 2 ? item.warehouse_id?.value ? item.warehouse_id?.value : null : null,
                };

                return detail;
            });

            const purchaseReturnData = {
                purchase_order_id,
                status,
                purchase_return_detail
            }


            const saleReturnData = {
                sale_invoice_id,
                sale_return_detail
            }

            const stockReturnData = {
                picklist_id,
                status,
                stock_return_detail
            }

            await dispatch(returnSaleInvoice(saleReturnData)).unwrap();

            const uniqueTypes = [...new Set(type_id)];

            if (uniqueTypes.includes(2) && !uniqueTypes.includes(3) && !uniqueTypes.includes(4)) {
                dispatch(returnStockReturn(stockReturnData)).unwrap().catch(handleError)
            }
            else if (!uniqueTypes.includes(2) && (uniqueTypes.includes(3) || uniqueTypes.includes(4))) {
                dispatch(returnPurchaseOrder(purchaseReturnData)).unwrap().catch(handleError)
            }
            else if (uniqueTypes.includes(2) && (uniqueTypes.includes(3) || uniqueTypes.includes(4))) {
                const filteredStock = tableData.filter(item => item?.product_type_id?.value === 2);
                const filteredPurchase = tableData.filter(item => item?.product_type_id?.value === 3 || item?.product_type_id?.value === 4);

                if (filteredStock.length > 0) {
                    const stockDetails = filteredStock.map(item => ({
                        picklist_detail_id: item.picklist_detail_id,
                        quantity: item.return_quantity,
                        warehouse_id: item.warehouse_id?.value ? item.warehouse_id?.value : null,
                    }));

                    dispatch(returnStockReturn({
                        picklist_id,
                        status,
                        stock_return_detail: stockDetails
                    })).unwrap().catch(handleError);
                }

                if (filteredPurchase.length > 0) {
                    const purchaseDetails = filteredPurchase.map(item => ({
                        purchase_order_detail_id: item.purchase_order_detail_id,
                        quantity: item.return_quantity,
                        warehouse_id: null,
                    }));

                    dispatch(returnPurchaseOrder({
                        purchase_order_id,
                        status,
                        purchase_return_detail: purchaseDetails
                    })).unwrap().catch(handleError);
                }
            }
            toast.success('Return created successfully');
            onClose();
            onRefresh?.();
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
                const isRequired = product_type_id?.value === 2;
                return (
                    <Form.Item
                        className="m-0"
                        name={`warehouse_id_${index}`}
                        rules={
                            isRequired
                                ? [{
                                    required: true,
                                    message: 'Warehouse is required'
                                }]
                                : []
                        }>
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
            width={800}
            footer={[
                <Button key="cancel" onClick={() => onClose()}>
                    Cancel
                </Button>,
                <Button key="return" type="primary" onClick={handleReturn}>
                    Return
                </Button>
            ]}
        >
            <Form form={form}>
                <Table
                    dataSource={tableData}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    size="small"
                />
            </Form>
        </Modal>
    );
};

export default ReturnModal;
