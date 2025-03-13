import { Breadcrumb, DatePicker, Input, Select, Table } from 'antd';
import dayjs from 'dayjs';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';

const Dispatch = () => {
  const columns = [
    {
      title: (
        <div>
          <p>Date</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker size="small" className="font-normal" format="MM-DD-YYYY" />
          </div>
        </div>
      ),
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      width: 150,
      ellipsis: true,
      render: (_, { date }) => (date ? dayjs(date).format('MM-DD-YYYY') : null)
    },
    {
      title: (
        <div>
          <p>Event Number</p>
          <Input className="font-normal" size="small" onClick={(e) => e.stopPropagation()} />
        </div>
      ),
      dataIndex: 'event_no',
      key: 'event_no',
      sorter: true,
      width: 200,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Vessel Name</p>
          <AsyncSelect
            endpoint="/vessel"
            size="small"
            labelKey="name"
            valueKey="vessel_id"
            className="w-full font-normal"
          />
        </div>
      ),
      dataIndex: 'vessel_name',
      key: 'vessel_name',
      sorter: true,
      width: 200,
      ellipsis: true
    },
    {
      title: (
        <div>
          <p>Technician Notes</p>
          <Input className="font-normal" size="small" onClick={(e) => e.stopPropagation()} />
        </div>
      ),
      dataIndex: 'technicians_notes',
      key: 'technicians_notes',
      sorter: true,
      width: 200,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Agent</p>
          <AsyncSelect
            endpoint="/agent"
            size="small"
            className="w-full font-normal"
            valueKey="agent_id"
            labelKey="name"
          />
        </div>
      ),
      dataIndex: 'agent_name',
      key: 'agent_name',
      sorter: true,
      width: 200,
      ellipsis: true
    },
    {
      title: (
        <div>
          <p>Agent Notes</p>
          <Input className="font-normal" size="small" onClick={(e) => e.stopPropagation()} />
        </div>
      ),
      dataIndex: 'agent_notes',
      key: 'agent_notes',
      sorter: true,
      width: 200,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Status</p>
          <Select size="small" className="w-full font-normal" allowClear />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      width: 180,
      ellipsis: true
    }
  ];

  const list = [];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>DISPATCH</PageHeading>
        <Breadcrumb items={[{ title: 'Dispatch' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <Input placeholder="Search..." className="w-full sm:w-64" />

        <Table
          size="small"
          loading={false}
          className="mt-2"
          rowKey="id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: 12,
            pageSize: 50,
            current: 1,
            showTotal: (total) => `Total ${total}`
          }}
          dataSource={list}
          showSorterTooltip={false}
          columns={columns}
          sticky={{
            offsetHeader: 56
          }}
        />
      </div>
    </>
  );
};

export default Dispatch;
