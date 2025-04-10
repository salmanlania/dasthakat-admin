import { Breadcrumb, Button, DatePicker, Input, Select, Table, TimePicker, Tooltip } from 'antd';
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
  updateDispatch,
} from '../../store/features/dispatchSlice.js';
import { createIJOPrint } from '../../utils/prints/ijo-print.js';
import { createPickListPrint } from '../../utils/prints/pick-list-print.js';
import { FaRegFileExcel } from 'react-icons/fa6';

const Scheduling = () => {
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isFormSubmitting } = useSelector(
    (state) => state.dispatch
  );
  const [tableKey, setTableKey] = useState(0);

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
      const exportParams = {
        ...params,
        start_date: null,
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

      dispatch(setDispatchListParams(originalParams));
      dispatch(getDispatchList(originalParams));

      generateSchedulingExcel(data, true);
    } catch (error) {
      dispatch(setDispatchListParams(originalParams));
      dispatch(getDispatchList(originalParams));
      handleError(error);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const exportPdf = async () => {
    const loadingToast = toast.loading('Loading Print View...');

    const originalParams = { ...params };

    try {
      const exportParams = {
        ...params,
        start_date: null,
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

      dispatch(setDispatchListParams(originalParams));
      dispatch(getDispatchList(originalParams));

      createSchedulingListPrint(Array.isArray(data) ? data : [data], true);
    } catch (error) {
      dispatch(setDispatchListParams(originalParams));
      dispatch(getDispatchList(originalParams));
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
      // sorter: true,
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
                // event_id,
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
                dispatch(setDispatchListParams({ event_time: time ? time.format('HH:mm') : null }))
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
            onChange={(selected) => dispatch(setDispatchListParams({ agent_id: selected }))}
          />
        </div>
      ),
      dataIndex: 'agent_name',
      key: 'agent',
      sorter: true,
      width: 200,
      ellipsis: true,
      render: (_, { event_id, agent_id, agent_name }) => (
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
          size="small"
          className="w-full"
        />
      )
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
          <Select size="small" className="w-full font-normal" allowClear />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      width: 180,
      ellipsis: true,
      render: (_, { status }) => (
        <Select size="small" className="w-full" allowClear disabled={!permissions.update} />
      )
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
    dispatch(getDispatchList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.agent_id,
    params.technician_id,
    params.user_id,
    params.vessel_id,
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
                params.start_date ? dayjs(params.start_date, 'YYYY-MM-DD') : null,
                params.end_date ? dayjs(params.end_date, 'YYYY-MM-DD') : null
              ]}
              onChange={(dates) => {
                const newParams = {
                  start_date: dates?.[0] ? dayjs(dates[0]).format('YYYY-MM-DD') : null,
                  end_date: dates?.[1] ? dayjs(dates[1]).format('YYYY-MM-DD') : null
                };

                dispatch(setDispatchListParams(newParams));
                dispatch(getDispatchList({ ...params, ...newParams }));
              }}
              format="MM-DD-YYYY"
            />
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
                        {/* {dateValue !== 'No Date'
                          ? `Date: ${dayjs(dateValue).format('MM-DD-YYYY')}`
                          : 'Date: Empty'} */}
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
