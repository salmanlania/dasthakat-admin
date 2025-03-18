import { Breadcrumb, Button, DatePicker, Input, Select, Table, TimePicker, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegFilePdf } from 'react-icons/fa';
import { TbEdit } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import NotesModal from '../../components/Modals/NotesModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import {
  getDispatchList,
  setDispatchListParams,
  updateDispatch
} from '../../store/features/dispatchSlice';
import { getIJOForPrint } from '../../store/features/ijoSlice';
import { createIJOPrint } from '../../utils/prints/ijo-print';

const Dispatch = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isFormSubmitting } = useSelector(
    (state) => state.dispatch
  );
  const [notesModalIsOpen, setNotesModalIsOpen] = useState({
    open: false,
    id: null,
    column: null,
    notes: null
  });

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedTechnicianNotes = useDebounce(params.technician_notes, 500);
  const debouncedAgentNotes = useDebounce(params.agent_notes, 500);

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
      const data = await dispatch(getIJOForPrint(id)).unwrap();
      toast.dismiss(loadingToast);
      createIJOPrint(data);
    } catch (error) {
      handleError(error);
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
              value={params.event_date ? dayjs(params.event_date) : null}
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
      sorter: true,
      width: 150,
      ellipsis: true,
      render: (_, { event_id, event_date }) => (
        <DatePicker
          size="small"
          className="font-normal"
          format="MM-DD-YYYY"
          defaultValue={event_date ? dayjs(event_date) : null}
          onChange={(date) =>
            updateValue(event_id, 'event_date', date ? dayjs(date).format('YYYY-MM-DD') : null)
          }
        />
      )
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
      ellipsis: true,
      render: (_, { event_id, vessel_id, vessel_name }) => (
        <AsyncSelect
          endpoint="/vessel"
          labelKey="name"
          valueKey="vessel_id"
          size="small"
          labelInValue
          defaultValue={
            vessel_id
              ? {
                  value: vessel_id,
                  label: vessel_name
                }
              : null
          }
          onChange={(selected) =>
            updateValue(event_id, 'vessel_id', selected ? selected.value : null)
          }
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
            valueKey="technician_id"
            className="w-full font-normal"
            mode="multiple"
            value={params.technician_id}
            onChange={(selected) => dispatch(setDispatchListParams({ technician_id: selected }))}
          />
        </div>
      ),
      dataIndex: 'technician',
      key: 'technician',
      sorter: true,
      width: 200,
      ellipsis: true,
      render: (_, { event_id, technicians, technician_name }) => (
        <AsyncSelect
          endpoint="/technician"
          labelKey="name"
          valueKey="technician_id"
          labelInValue
          defaultValue={
            technicians
              ? technicians.map((item) => ({
                  value: item.technician_id,
                  label: item.name
                }))
              : null
          }
          mode="multiple"
          onChange={(selected) =>
            updateValue(
              event_id,
              'technician_id',
              selected ? selected.map((item) => item.value) : null
            )
          }
          className="w-full"
          size="small"
        />
      )
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
              className={`absolute -right-2 ${technician_notes?.trim() ? '-top-[2px]' : '-top-[12px]'} flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white`}>
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
      dataIndex: 'agent',
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
              className={`absolute -right-2 ${agent_notes?.trim() ? '-top-[2px]' : '-top-[12px]'} flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white`}>
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
      render: (_, { status }) => <Select size="small" className="w-full" allowClear />
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, { job_order_id }) => (
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-1">
            <Tooltip title="Print IJO">
              <Button
                size="small"
                type="primary"
                className="bg-rose-600 hover:!bg-rose-500"
                icon={<FaRegFilePdf size={14} />}
                onClick={() => printIJO(job_order_id)}
              />
            </Tooltip>
          </div>
        </div>
      ),
      width: 80,
      fixed: 'right'
    }
  ];

  useEffect(() => {
    dispatch(getDispatchList(params)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.agent_id,
    params.technician_id,
    params.vessel_id,
    params.event_id,
    params.event_date,
    params.event_time,
    params.technician_id,
    debouncedSearch,
    debouncedTechnicianNotes,
    debouncedAgentNotes
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>DISPATCH</PageHeading>
        <Breadcrumb items={[{ title: 'Dispatch' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <Input
          placeholder="Search..."
          className="w-full sm:w-64"
          value={params.search}
          onChange={(e) => dispatch(setDispatchListParams({ search: e.target.value }))}
        />

        <Table
          size="small"
          loading={isListLoading}
          className="mt-2"
          rowKey="event_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
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

      <NotesModal
        title={notesModalIsOpen.column === 'technician_notes' ? 'Technician Notes' : 'Agent Notes'}
        initialValue={notesModalIsOpen.notes}
        isSubmitting={isFormSubmitting}
        open={notesModalIsOpen.open}
        onCancel={closeNotesModal}
        onSubmit={onNotesSave}
      />
    </>
  );
};

export default Dispatch;
