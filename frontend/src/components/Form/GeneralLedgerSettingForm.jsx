import { Col, Form, Row } from 'antd';
import AsyncSelectLedger from '../AsyncSelectLedger';
import { useSelector } from 'react-redux';

export default function GeneralLedgerSettingForm() {
    const { user } = useSelector((state) => state.auth);
    const permissions = user?.permission;
    return (
        <div className="rounded border border-gray-200 bg-white p-6">
            <Form.Item
                label="Transaction Accounts"
                name="transaction_account"
                className="mb-6"
            >
                <AsyncSelectLedger
                    endpoint="/accounts?only_leaf=1"
                    size="small"
                    className="w-full font-normal custom-transaction-select"
                    valueKey="account_id"
                    labelKey="name"
                    allowClear
                    mode="multiple"
                />
            </Form.Item>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Cash Account" name="cash_account">
                        <AsyncSelectLedger
                            endpoint="/accounts?only_leaf=1"
                            size="small"
                            className="w-full font-normal custom-transaction-select-others"
                            valueKey="account_id"
                            labelKey="name"
                            allowClear
                            // addNewLink={permissions?.accounts?.list && permissions?.accounts?.add ? '/general-ledger/gl-setup/accounts' : null}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Sales Tax Account" name="sales_tax_account">
                        <AsyncSelectLedger
                            endpoint="/accounts?only_leaf=1"
                            size="small"
                            className="w-full font-normal custom-transaction-select-others"
                            valueKey="account_id"
                            labelKey="name"
                            allowClear
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Suspense Account" name="suspense_account">
                        <AsyncSelectLedger
                            endpoint="/accounts?only_leaf=1"
                            size="small"
                            className="w-full font-normal custom-transaction-select-others"
                            valueKey="account_id"
                            labelKey="name"
                            allowClear
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Default Receivable Account" name="default_receivable_account">
                        <AsyncSelectLedger
                            endpoint="/accounts?only_leaf=1"
                            size="small"
                            className="w-full font-normal custom-transaction-select-others"
                            valueKey="account_id"
                            labelKey="name"
                            allowClear
                            disabled
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Default Payable Account" name="default_payable_account">
                        <AsyncSelectLedger
                            endpoint="/accounts?only_leaf=1"
                            size="small"
                            className="w-full font-normal custom-transaction-select-others"
                            valueKey="account_id"
                            labelKey="name"
                            allowClear
                            disabled
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Undeposited Account" name="undeposited_account">
                        <AsyncSelectLedger
                            endpoint="/accounts?only_leaf=1"
                            size="small"
                            className="w-full font-normal custom-transaction-select-others"
                            valueKey="account_id"
                            labelKey="name"
                            allowClear
                        />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    )
}
