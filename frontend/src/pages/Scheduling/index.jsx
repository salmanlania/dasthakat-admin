import {
  Breadcrumb,
  Button,
  DatePicker,
  Input,
  Select,
  Table,
  Tag,
  TimePicker,
  Checkbox,
  Tooltip,
  message
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { FaRegFilePdf } from 'react-icons/fa';
import { TbEdit } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import AsyncSelect from '../../components/AsyncSelect/index.jsx';
import PageHeading from '../../components/Heading/PageHeading.jsx';
import NotesModal from '../../components/Modals/NotesModal.jsx';
import useDebounce from '../../hooks/useDebounce.js';
import useError from '../../hooks/useError.jsx';
import generateSchedulingExcel from '../../utils/excel/scheduling-excel.js';
import createSchedulingListPrint from '../../utils/Pdf/scheduling-list.js';
import {
  getDispatchList,
  getEventJobOrders,
  getEventPickLists,
  setDispatchListParams,
  updateDispatch
} from '../../store/features/dispatchSlice.js';
import { createIJOPrint } from '../../utils/prints/ijo-print.js';
import { createPickListPrint } from '../../utils/prints/pick-list-print.js';
import { FaRegFileExcel } from 'react-icons/fa6';
import { CopyOutlined } from '@ant-design/icons';

const Scheduling = () => {
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isFormSubmitting } = useSelector(
    (state) => state.dispatch
  );
  const [tableKey, setTableKey] = useState(0);
  const [isOldChecked, setIsOldChecked] = useState(false);
  const [agentDetails, setAgentDetails] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.dispatch;

  const [notesModalIsOpen, setNotesModalIsOpen] = useState({
    open: false,
    id: null,
    column: null,
    notes: null
  });

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedTechnicianNotes = useDebounce(params.technician_notes, 500);
  const debouncedAgentNotes = useDebounce(params.agent_notes, 500);

  const groupedData = useMemo(() => {
    if (!list || !list.length) return [];

    const result = [];
    const groupedByDate = {};

    list.forEach((item) => {
      const eventDate =
        item.event_date && item.event_date !== '0000-00-00'
          ? dayjs(item.event_date).format('MM-DD-YYYY')
          : 'No Date';

      if (!groupedByDate[eventDate]) {
        groupedByDate[eventDate] = [];
      }

      groupedByDate[eventDate].push(item);
    });

    Object.keys(groupedByDate).forEach((date) => {
      result.push({
        isDateHeader: true,
        event_date: date,
        event_id: `header-${date}`
      });

      groupedByDate[date].forEach((item) => {
        result.push(item);
      });
    });

    return result;
  }, [list]);

  const closeNotesModal = () => {
    setNotesModalIsOpen({ open: false, id: null, column: null, notes: null });
  };

  const updateValue = async (id, key, value) => {
    try {
      await dispatch(
        updateDispatch({
          id,
          data: { [key]: value }
        })
      ).unwrap();
      dispatch(getDispatchList(params)).unwrap();
      setTableKey((prev) => prev + 1);
    } catch (error) {
      handleError(error);
    }
  };

  const onNotesSave = async ({ notes }) => {
    try {
      await updateValue(notesModalIsOpen.id, notesModalIsOpen.column, notes);
      dispatch(getDispatchList(params)).unwrap();
      closeNotesModal();
    } catch (error) {
      handleError(error);
    }
  };

  const printIJO = async (id) => {
    const loadingToast = toast.loading('Loading IJO print...');

    try {
      const data = await dispatch(getEventJobOrders(id)).unwrap();
      createIJOPrint(data, true);
    } catch (error) {
      handleError(error);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

const exportExcel = async () => {
  const loadingToast = toast.loading('Downloading Excel File...');

  const originalParams = { ...params };
  
  try {
    const newDate = !isOldChecked ? dayjs().format('YYYY-MM-DD') : null;
    const exportParams = {
      ...params,
      start_date: newDate,
      end_date: null,
      event_date: null,
      search: null,
      technician_notes: null,
      agent_notes: null,
      technician_id: null,
      vessel_id: null,
      agent_id: null,
      event_id: null,
      sort_direction: 'ascend'
    };

    const data = await dispatch(getDispatchList(exportParams)).unwrap();
    
    generateSchedulingExcel(data, true);
    
    await dispatch(setDispatchListParams(originalParams)).unwrap();
    await dispatch(getDispatchList(originalParams)).unwrap();
    
    setTableKey(prevKey => prevKey + 1);
    
  } catch (error) {
    await dispatch(setDispatchListParams(originalParams)).unwrap();
    await dispatch(getDispatchList(originalParams)).unwrap();
    handleError(error);
  } finally {
    toast.dismiss(loadingToast);
  }
};

const exportPdf = async () => {
  const loadingToast = toast.loading('Loading Print View...');

  const originalParams = { ...params };
  
  try {
    const newDate = !isOldChecked ? dayjs().format('YYYY-MM-DD') : null;
    const exportParams = {
      ...params,
      start_date: newDate,
      end_date: null,
      event_date: null,
      search: null,
      technician_notes: null,
      agent_notes: null,
      technician_id: null,
      vessel_id: null,
      agent_id: null,
      event_id: null
    };

    const data = await dispatch(getDispatchList(exportParams)).unwrap();
    
    createSchedulingListPrint(Array.isArray(data) ? data : [data], true);
    
    await dispatch(setDispatchListParams(originalParams)).unwrap();
    await dispatch(getDispatchList(originalParams)).unwrap();
    
    setTableKey(prevKey => prevKey + 1);
    
  } catch (error) {
    await dispatch(setDispatchListParams(originalParams)).unwrap();
    await dispatch(getDispatchList(originalParams)).unwrap();
    handleError(error);
  } finally {
    toast.dismiss(loadingToast);
  }
};

  const printPickLists = async (id) => {
    const loadingToast = toast.loading('Loading Pick Lists print...');

    try {
      const data = await dispatch(getEventPickLists(id)).unwrap();
      createPickListPrint(data, true);
    } catch (error) {
      handleError(error);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleCopy = (data) => {
    navigator.clipboard
      .writeText(data)
      .then(() => {
        message.success('copied!');
      })
      .catch((err) => {
        message.error('Failed to copy');
      });
  };

  const statusOptions = [
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Partial', value: 'Partial' },
    { label: 'PPW Pending', value: 'PPW Pending' },
    { label: 'Samples pending', value: 'Samples pending' },
    { label: 'Completed', value: 'Completed' }
  ];

  const columns = [
    {
      title: (
        <div>
          <p>Date</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              size="small"
              value={
                params.event_date && params.event_date !== '0000-00-00'
                  ? dayjs(params.event_date)
                  : null
              }
              className="font-normal"
              onChange={(date) =>
                dispatch(
                  setDispatchListParams({
                    event_date: date ? dayjs(date).format('YYYY-MM-DD') : null
                  })
                )
              }
              format="MM-DD-YYYY"
            />
          </div>
        </div>
      ),
      dataIndex: 'event_date',
      key: 'event_date',
      sorter: (a, b) => {
        if (a.isDateHeader || b.isDateHeader) return 0;
        const aDate = a.event_date ? dayjs(a.event_date) : dayjs(0);
        const bDate = b.event_date ? dayjs(b.event_date) : dayjs(0);
        return aDate - bDate;
      },
      width: 150,
      ellipsis: true,
      render: (text, record) => {
        if (record.isDateHeader) {
          return null;
        }
        return (
          <DatePicker
            size="small"
            className="font-normal"
            format="MM-DD-YYYY"
            disabled={!permissions.update}
            defaultValue={
              record.event_date && record.event_date !== '0000-00-00'
                ? dayjs(record.event_date)
                : null
            }
            onChange={async (date) => {
              await updateValue(
                record.event_id,
                'event_date',
                date ? dayjs(date).format('YYYY-MM-DD') : null
              );

              dispatch(getDispatchList(params))
                .unwrap()
                .then(() => setTableKey((prev) => prev + 1));
            }}
          />
        );
      }
    },
    {
      title: (
        <div>
          <p>Time</p>
          <div onClick={(e) => e.stopPropagation()}>
            <TimePicker
              size="small"
              value={params.event_time ? dayjs(params.event_time, 'HH:mm') : null}
              className="font-normal"
              showSecond={false}
              onChange={(time) =>
                dispatch(setDispatchListParams({ event_time: time ? time.format('HH:mm:ss') : null }))
              }
            />
          </div>
        </div>
      ),
      dataIndex: 'event_time',
      key: 'event_time',
      sorter: true,
      width: 150,
      ellipsis: true,
      render: (_, { event_id, event_time }) => (
        <TimePicker
          size="small"
          className="font-normal"
          showSecond={false}
          allowClear={false}
          disabled={!permissions.update}
          defaultValue={event_time ? dayjs(event_time, 'HH:mm') : null}
          onChange={(date) =>
            updateValue(event_id, 'event_time', date ? dayjs(date).format('HH:mm') : null)
          }
        />
      )
    },
    {
      title: (
        <div>
          <p>Event Number</p>
          <AsyncSelect
            endpoint="/event"
            size="small"
            labelKey="event_code"
            valueKey="event_id"
            className="w-full font-normal"
            value={params.event_id}
            onChange={(selected) => dispatch(setDispatchListParams({ event_id: selected }))}
          />
        </div>
      ),
      dataIndex: 'event_code',
      key: 'event_code',
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
            value={params.vessel_id}
            onChange={(selected) => dispatch(setDispatchListParams({ vessel_id: selected }))}
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
        <div onClick={(e) => e.stopPropagation()}>
          <p>Ports</p>
          <AsyncSelect
            endpoint="/port"
            size="small"
            labelKey="name"
            valueKey="port_id"
            className="w-full font-normal"
            mode="multiple"
            value={params.port_id}
            onChange={(selected) => dispatch(setDispatchListParams({ port_id: selected }))}
          />
        </div>
      ),
      dataIndex: 'ports',
      key: 'ports',
      sorter: false,
      width: 200,
      ellipsis: true,
      render: (_, { event_id, ports }) => {       
        return ( <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <AsyncSelect
          endpoint="/port"
          multiple
          valueKey="port_id"
          labelKey="name"
          labelInValue
          disabled={!permissions.update}
          defaultValue={
            ports[0]
              ? {
                  value: ports[0].port_id,
                  label: ports[0].name
                }
              : null
          }
          onChange={(selected) =>
            updateValue(event_id, 'port_id', selected ? selected.value : null)
          }
          className="w-[90%]"
          size="small"
          style={{
            width: '90%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        />
      </div>)
        // if (!ports || !Array.isArray(ports)) return '';

        // const portNames = ports.map((port) => port.name || port).join(', ');
        // return (
        //   <span className="line-clamp-1 block overflow-hidden text-ellipsis whitespace-nowrap">
        //     {portNames}
        //   </span>
        // );
      }
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Job Scope</p>
          <AsyncSelect
            endpoint="/product"
            size="small"
            labelKey="short_code"
            valueKey="short_code"
            mode="multiple"
            className="w-full font-normal"
            value={params.short_code}
            onChange={(selected) => dispatch(setDispatchListParams({ short_code: selected }))}
          />
        </div>
      ),
      dataIndex: 'short_codes',
      key: 'short_codes',
      width: 200,
      ellipsis: true,
      render: (_, { short_codes }) => {
        if (!Array.isArray(short_codes) || short_codes.length === 0) return '';

        return (
          <div className="flex flex-wrap gap-1">
            {short_codes.map((item, index) => (
              <div
                key={index}
                style={{ color: item?.color?.name || '#eee' }}
                className={`m-0 rounded border border-gray-200 bg-gray-50 px-2 py-[2px] text-xs text-white`}>
                {item.label || item}
              </div>
            ))}
          </div>
        );
      }
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Technician</p>
          <AsyncSelect
            endpoint="/user"
            size="small"
            labelKey="user_name"
            valueKey="user_id"
            className="w-full font-normal"
            mode="multiple"
            value={params.technician_id}
            onChange={(selected) => dispatch(setDispatchListParams({ technician_id: selected }))}
          />
        </div>
      ),
      dataIndex: 'user',
      key: 'user',
      sorter: false,
      width: 200,
      ellipsis: true,
      render: (_, { event_id, users, technicians }) => {
        const selectedValues = technicians
          ? technicians.map((tech) => ({
              value: tech.user_id,
              label: tech.user_name
            }))
          : [];
        return (
          <AsyncSelect
            endpoint="/user"
            labelKey="user_name"
            valueKey="user_id"
            labelInValue
            disabled={!permissions.update}
            defaultValue={selectedValues}
            mode="multiple"
            onChange={(selected) => {
              updateValue(
                event_id,
                'technician_id',
                selected ? selected.map((item) => item.value) : null
              );
            }}
            className="w-full"
            size="small"
          />
        );
      }
    },
    {
      title: (
        <div>
          <p>Technician Notes</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.technician_notes}
            onChange={(e) => dispatch(setDispatchListParams({ technician_notes: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'technician_notes',
      key: 'technician_notes',
      sorter: true,
      width: 200,
      ellipsis: true,
      render: (_, { event_id, technician_notes }) => {
        return (
          <div className="relative">
            <p>{technician_notes}</p>
            <div
              className={`absolute -right-2.5 ${technician_notes?.trim() ? '-top-[2px]' : '-top-[12px]'} flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white`}>
              <TbEdit
                size={22}
                className="text-primary hover:text-blue-600"
                onClick={() =>
                  setNotesModalIsOpen({
                    open: true,
                    id: event_id,
                    column: 'technician_notes',
                    notes: technician_notes
                  })
                }
              />
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
            valueKey="agent_id"
            labelKey="name"
            value={params.agent_id}
            onChange={(selected) => {
              dispatch(
                setDispatchListParams({
                  agent_id: selected
                })
              );
            }}
          />
        </div>
      ),
      dataIndex: 'agent_name',
      key: 'agent',
      sorter: true,
      width: 200,
      ellipsis: true,
      render: (_, { event_id, agent_id, agent_name, agent_email, agent_phone, agent_fax }) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <AsyncSelect
                endpoint="/agent"
                multiple
                valueKey="agent_id"
                labelKey="name"
                labelInValue
                disabled={!permissions.update}
                defaultValue={
                  agent_id
                    ? {
                        value: agent_id,
                        label: agent_name
                      }
                    : null
                }
                onChange={(selected) =>
                  updateValue(event_id, 'agent_id', selected ? selected.value : null)
                }
                className="w-[90%]"
                size="small"
                style={{
                  width: '90%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              />
            </div>
            <Tooltip
              title={
                <div>
                  <div>Name: {agent_name}</div>
                  <div>Email: {agent_email}</div>
                  <div>Phone: {agent_phone}</div>
                  <div>Fax: {agent_fax}</div>
                </div>
              }
              trigger="hover">
              <Button
                icon={<CopyOutlined />}
                size="small"
                onClick={() =>
                  handleCopy(
                    `Name: ${agent_name}\nEmail: ${agent_email}\nPhone: ${agent_phone}\nFax: ${agent_fax}`
                  )
                }
                style={{ marginLeft: '8px' }}
              />
            </Tooltip>
          </div>
        );
      }
    },
    {
      title: (
        <div>
          <p>Agent Notes</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.agent_notes}
            onChange={(e) => dispatch(setDispatchListParams({ agent_notes: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'agent_notes',
      key: 'agent_notes',
      sorter: true,
      width: 200,
      ellipsis: true,
      render: (_, { event_id, agent_notes }) => {
        return (
          <div className="relative">
            <p>{agent_notes}</p>
            <div
              className={`absolute -right-2.5 ${agent_notes?.trim() ? '-top-[2px]' : '-top-[12px]'} flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white`}>
              <TbEdit
                size={22}
                className="text-primary hover:text-blue-600"
                onClick={() =>
                  setNotesModalIsOpen({
                    open: true,
                    id: event_id,
                    column: 'agent_notes',
                    notes: agent_notes
                  })
                }
              />
            </div>
          </div>
        );
      }
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Status</p>
          <AsyncSelect
            endpoint="/status"
            size="small"
            className="w-full font-normal"
            valueKey="status_id"
            labelKey="name"
            value={params.status_id}
            onChange={(selected) => {
              dispatch(
                setDispatchListParams({
                  status_id: selected
                })
              );
            }}
          />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      width: 180,
      ellipsis: true,
      render: (_, { event_id, status }) => {
        return (
          <Select
            size="small"
            className="w-full"
            allowClear
            disabled={!permissions.update}
            options={statusOptions}
            value={status || null}
            onChange={(selectedValue) => updateValue(event_id, 'status', selectedValue || null)}
          />
        );
      }
    },
    {
      title: 'Print',
      key: 'print',
      align: 'center',
      render: (_, { event_id }) => (
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-1">
            <Tooltip title="Print IJO">
              <Button
                size="small"
                type="primary"
                className="w-20"
                onClick={() => printIJO(event_id)}>
                IJO
              </Button>
            </Tooltip>
            <Tooltip title="Print Pick Lists">
              <Button
                size="small"
                type="primary"
                className="w-20 bg-rose-600 hover:!bg-rose-500"
                onClick={() => printPickLists(event_id)}>
                PL
              </Button>
            </Tooltip>
          </div>
        </div>
      ),
      width: 100,
      fixed: 'right'
    }
  ];

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');

    const modifiedParams = {
      ...params,
      start_date: !isOldChecked ? today : params.start_date,
      end_date: !isOldChecked ? null : params.end_date
    };
    dispatch(getDispatchList(modifiedParams)).unwrap().catch(handleError);
  }, [
    isOldChecked,
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.agent_id,
    params.status_id,
    params.technician_id,
    params.short_code,
    params.user_id,
    params.vessel_id,
    params.port_id,
    params.event_id,
    params.event_date,
    params.start_date,
    params.end_date,
    params.event_time,
    debouncedSearch,
    debouncedTechnicianNotes,
    debouncedAgentNotes
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>SCHEDULING</PageHeading>
        <Breadcrumb items={[{ title: 'Scheduling' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex flex-wrap items-center justify-between">
          <div className="my-2 flex items-center gap-2">
            <Input
              placeholder="Search..."
              className="w-full sm:w-64"
              value={params.search}
              allowClear
              onChange={(e) => dispatch(setDispatchListParams({ search: e.target.value }))}
            />
            <RangePicker
              value={[
                params.start_date && params.start_date !== ''
                  ? dayjs(params.start_date, 'YYYY-MM-DD')
                  : null,
                params.end_date && params.end_date !== ''
                  ? dayjs(params.end_date, 'YYYY-MM-DD')
                  : null
              ]}
              onChange={(dates) => {
                const newParams = {
                  start_date: dates?.[0] ? dayjs(dates[0]).format('YYYY-MM-DD') : '',
                  end_date: dates?.[1] ? dayjs(dates[1]).format('YYYY-MM-DD') : ''
                };

                dispatch(setDispatchListParams(newParams));

                const today = dayjs().format('YYYY-MM-DD');
                const fetchParams = { ...params };
                if (dates && dates[0]) {
                  fetchParams.start_date = newParams.start_date;
                  fetchParams.end_date = newParams.end_date;
                }
                else {
                  if (!isOldChecked) {
                    fetchParams.start_date = today;
                    fetchParams.end_date = null;
                  } else {
                    fetchParams.start_date = null;
                    fetchParams.end_date = null;
                  }
                }

                dispatch(getDispatchList(fetchParams));
              }}
              format="MM-DD-YYYY"
            />
          </div>
          <div>
            <div className="my-2 flex items-center gap-2">
              <Checkbox checked={isOldChecked} onChange={(e) => setIsOldChecked(e.target.checked)}>
                Old Records
              </Checkbox>
            </div>
          </div>
          <div className="flex items-center justify-around gap-3">
            <Button
              type="primary"
              icon={<FaRegFileExcel size={14} />}
              className="bg-emerald-800 hover:!bg-emerald-700"
              onClick={exportExcel}>
              Export
            </Button>
            <Button
              type="primary"
              icon={<FaRegFilePdf size={14} />}
              className="bg-rose-600 hover:!bg-rose-500"
              onClick={exportPdf}>
              Print
            </Button>
          </div>
        </div>

        <Table
          key={tableKey}
          size="small"
          loading={isListLoading}
          className="mt-2"
          rowKey={(record) =>
            record.isDateHeader
              ? `header-${record.event_id}`
              : `${record.event_id}-${record.job_order_id}-${(record.technicians || []).join(',')}`
          }
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} scheduling`
          }}
          dataSource={groupedData}
          showSorterTooltip={false}
          columns={columns}
          sticky={{
            offsetHeader: 56
          }}
          onRow={(record) => {
            return {
              className: record.isDateHeader ? 'date-header-row' : ''
            };
          }}
          components={{
            body: {
              row: (props) => {
                const { children, className, ...restProps } = props;

                if (className && className.includes('date-header-row')) {
                  const dateValue = props['data-row-key'].replace('header-', '');

                  const formattedDate =
                    dateValue && dayjs(dateValue).isValid()
                      ? dayjs(dateValue).format('MM-DD-YYYY')
                      : '';

                  return (
                    <tr {...restProps} className="date-header-row bg-[#fafafa] font-bold">
                      <td colSpan={columns.length} className="text-md px-4 py-2 text-[#285198]">
                       {formattedDate ? `Date: ${formattedDate}` : 'Date: Empty'}
                      </td>
                    </tr>
                  );
                }

                return <tr {...props} />;
              }
            }
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setDispatchListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order
              })
            );
          }}
        />
      </div>

      <NotesModal
        title={notesModalIsOpen.column === 'technician_notes' ? 'Technician Notes' : 'Agent Notes'}
        initialValue={notesModalIsOpen.notes}
        isSubmitting={isFormSubmitting}
        open={notesModalIsOpen.open}
        onCancel={closeNotesModal}
        onSubmit={onNotesSave}
        disabled={!permissions.update}
      />
      <style>{`
        :global(.date-header-row) {
          background-color: #f3f4f6;
          font-weight: bold;
        }

        :global(.date-header-row td) {
          padding: 8px 16px;
          font-size: 16px;
          border-bottom: 1px solid #d1d5db;
        }

        :global(.date-grouped-table .ant-table-tbody > tr.date-header-row:hover > td) {
          background-color: #f3f4f6 !important;
        }
      `}</style>
    </>
  );
};

export default Scheduling;
