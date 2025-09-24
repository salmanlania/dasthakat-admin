import { Col, Form, Row } from 'antd';
import AsyncSelectLedger from '../AsyncSelectLedger';

export default function InventorySettingForm() {
    return (
        <div className="rounded border border-gray-200 bg-white p-6">
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        label="Inventory Accounts"
                        name="inventory_accounts"
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
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Revenue Accounts"
                        name="revenue_accounts"
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
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        label="COGS Accounts"
                        name="cogs_accounts"
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
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Adjustment Accounts"
                        name="adjustment_accounts"
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
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        label="Purchase Discount Account"
                        name="purchase_discount_account"
                    >
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
                    <Form.Item
                        label="Sale Discount Account"
                        name="sale_discount_account"
                    >
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
                    <Form.Item
                        label="P & L Account"
                        name="pl_account"
                    >
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
                    <Form.Item
                        label="Cartage Account"
                        name="cartage_account"
                    >
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
                    <Form.Item
                        label="Contra Account"
                        name="contra_account"
                    >
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
    );
}
