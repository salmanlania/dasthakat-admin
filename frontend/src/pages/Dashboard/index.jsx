import { Col, DatePicker, Row, Select } from 'antd';
import { FaArrowDown, FaArrowUp, FaDollarSign, FaReceipt } from 'react-icons/fa6';
import { GoArrowUpRight } from 'react-icons/go';
import DashboardCard from '../../components/Card/DashboardCard';
import PageHeading from '../../components/heading/PageHeading';

const shortcuts = [
  { title: 'Chart of Accounts' },
  { title: 'Sales Invoice' },
  { title: 'Purchase Invoice' },
  { title: 'Journal Entry' },
  { title: 'Payment Entry' },
  { title: 'Accounts Receivable' },
  { title: 'General Ledger' },
  { title: 'Trial Balance' }
];

const months = [
  { label: 'January', value: '01' },
  { label: 'February', value: '02' },
  { label: 'March', value: '03' },
  { label: 'April', value: '04' },
  { label: 'May', value: '05' },
  { label: 'June', value: '06' },
  { label: 'July', value: '07' },
  { label: 'August', value: '08' },
  { label: 'September', value: '09' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' }
];

const Dashboard = () => {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <PageHeading>DASHBOARD</PageHeading>

        <div className="flex items-center gap-2">
          <DatePicker picker="year" />
          <Select
            options={months}
            className="w-40"
            placeholder="Select Month"
            optionFilterProp="label"
            showSearch
            allowClear
          />
        </div>
      </div>

      <Row gutter={[12, 12]} className="mt-4">
        <Col span={24} lg={6} md={8} sm={12}>
          <DashboardCard
            title="Total Sales"
            value="$10,000"
            icon={<FaDollarSign size={24} className="text-primary" />}
          />
        </Col>
        <Col span={24} lg={6} md={8} sm={12}>
          <DashboardCard
            title="Total Purchases"
            value="$5,000"
            icon={<FaReceipt size={24} className="text-primary" />}
          />
        </Col>
        <Col span={24} lg={6} md={8} sm={12}>
          <DashboardCard
            title="Incoming Payment"
            value="$7,000"
            icon={<FaArrowDown size={24} className="text-primary" />}
          />
        </Col>
        <Col span={24} lg={6} md={8} sm={12}>
          <DashboardCard
            title="Outgoing Payment"
            value="$8,000"
            icon={<FaArrowUp size={24} className="text-primary" />}
          />
        </Col>
      </Row>

      <div className="mt-4 w-full rounded-md bg-white p-4 shadow-sm">
        <h4 className="text-lg">Shortcuts</h4>
        <Row gutter={[12, 12]} className="mt-4">
          {shortcuts.map(({ title }, i) => (
            <Col span={24} lg={6} md={8} sm={12} key={i}>
              <div className="flex h-6 w-fit cursor-pointer items-center gap-1 text-sm text-gray-600 transition-all hover:border-b hover:border-gray-400">
                <span>{title}</span>
                <GoArrowUpRight size={16} />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
