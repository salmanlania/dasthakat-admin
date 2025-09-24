/* eslint-disable react/prop-types */
import { Modal, Table, Spin } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useError from "../../hooks/useError";
import { getCustomerPaymentLedger } from "../../store/features/customerPaymentSlice";

const LedgerModal = ({ open, onClose, initialFormValues }) => {
    const { id } = useParams();
    const document_id = id
    const dispatch = useDispatch()
    const handleError = useError()
    const { ledgerLoading, ledger, ledgerData } = useSelector(
        (state) => state.customerPayment
    );

    useEffect(() => {
        if (open && initialFormValues) {
            const typeId = initialFormValues?.document_type_id;
            dispatch(getCustomerPaymentLedger({ typeId, document_id }))
                .unwrap()
                .catch(handleError);
        }
    }, [initialFormValues, open])

    const columns = [
        {
            title: "Account",
            dataIndex: "account_name",
            key: "account_name",
        },
        {
            title: "Debit",
            dataIndex: "debit_amount",
            key: "debit_amount",
        },
        {
            title: "Credit",
            dataIndex: "credit_amount",
            key: "credit_amount",
        },
    ];

    return (
        <Modal
            title={<h1 className="flex justify-center mb-">Ledger Entry</h1>}
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            {ledgerLoading && (
                <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
                    <Spin size="large" />
                </div>
            )}
            {!ledgerLoading && ledger ? (
                <Table
                    columns={columns}
                    dataSource={ledger}
                    rowKey="id"
                    pagination={false}
                    summary={() => {
                        if (!ledger?.length) {
                            return null;
                        }
                        return (
                            <>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0}><strong>Total</strong></Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}><strong>{ledgerData?.total_debit ? ledgerData?.total_debit : null}</strong></Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}><strong>{ledgerData?.total_credit ? ledgerData?.total_credit : null}</strong></Table.Summary.Cell>
                                </Table.Summary.Row>
                            </>
                        );
                    }}
                />
            ) : null}
        </Modal>
    );
};

export default LedgerModal;