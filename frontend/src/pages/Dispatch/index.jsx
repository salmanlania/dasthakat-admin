import { Breadcrumb, DatePicker, Input, Select, Table } from 'antd';
import dayjs from 'dayjs';
import { FaPen } from 'react-icons/fa';
import { MdEdit, MdModeEdit, MdOutlineEdit } from 'react-icons/md';
import { TbEdit } from 'react-icons/tb';
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
      render: (_, { date }) => (
        <DatePicker size="small" className="font-normal" format="MM-DD-YYYY" />
      )
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
      width: 140,
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
      ellipsis: true,
      render: (_, { agent }) => (
        <AsyncSelect
          endpoint="/vessel"
          labelKey="name"
          valueKey="vessel_id"
          size="small"
          className="w-full"
        />
      )
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Technician</p>
          <AsyncSelect
            endpoint="/technician"
            size="small"
            labelKey="name"
            multiple
            valueKey="technician_id"
            className="w-full font-normal"
          />
        </div>
      ),
      dataIndex: 'technician',
      key: 'technician',
      sorter: true,
      width: 200,
      ellipsis: true,
      render: (_, { technician }) => (
        <AsyncSelect endpoint="/technician" className="w-full" size="small" />
      )
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
      ellipsis: true,
      render: (notes) => {
        return (
          <div className="relative">
            <p>{notes}</p>
            <div className="absolute -right-2 -top-[2px] flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white">
              <TbEdit size={22} className="text-primary hover:text-blue-600" />
            </div>
          </div>
        );
      }
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Agent</p>
          <AsyncSelect
            endpoint="/agent"
            size="small"
            className="w-full font-normal"
            multiple
            valueKey="agent_id"
            labelKey="name"
          />
        </div>
      ),
      dataIndex: 'agent',
      key: 'agent',
      sorter: true,
      width: 200,
      ellipsis: true,
      render: (_, { agent }) => (
        <AsyncSelect
          endpoint="/agent"
          multiple
          valueKey="agent_id"
          labelKey="name"
          size="small"
          className="w-full"
        />
      )
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
      ellipsis: true,
      render: (notes) => {
        return (
          <div className="relative">
            <p>{notes}</p>
            <div className="absolute -right-2 -top-[2px] flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white">
              <TbEdit size={22} className="text-primary hover:text-blue-600" />
            </div>
          </div>
        );
      }
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
      ellipsis: true,
      render: (_, { status }) => <Select size="small" className="w-full" allowClear />
    }
  ];

  const list = [
    {
      id: 1,
      date: dayjs(),
      event_no: '123',
      vessel_name: {
        value: 1,
        label: 'Vessel1'
      },
      technician: [
        {
          value: 1,
          label: 'Technician1'
        },
        {
          value: 2,
          label: 'Technician2'
        }
      ],
      technicians_notes:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      agent: [
        {
          value: 1,
          label: 'Agent1'
        },
        {
          value: 2,
          label: 'Agent2'
        }
      ],
      agent_notes:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      status: 'F'
    }
  ];

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
            showTotal: (total) => `Total ${total} dispatch`
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
