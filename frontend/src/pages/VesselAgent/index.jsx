import { Breadcrumb, Button, Dropdown, Form, Select, Table } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import DebouncedNumberInput from '../../components/Input/DebouncedNumberInput';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import {
  addCommissionDetail,
  changeCommissionDetailOrder,
  changeCommissionDetailValue,
  copyCommissionDetail,
  getVessel,
  removeCommissionDetail,
  resetCommissionDetails,
  updateVesselAgent,
} from '../../store/features/vesselSlice';

const VesselAgent = () => {
  useDocumentTitle('Vessel Agent');
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleError = useError();
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;

  const { isItemLoading, isFormSubmitting, commissionDetails } = useSelector(
    (state) => state.vessel,
  );

  console.log('commissionDetails', commissionDetails);

  const columns = [
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addCommissionDetail())}
        />
      ),
      key: 'order',
      dataIndex: 'order',
      render: (_, record, index) => {
        return (
          <div className="flex flex-col gap-1">
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropup size={16} />}
              disabled={index === 0}
              onClick={() => {
                dispatch(changeCommissionDetailOrder({ from: index, to: index - 1 }));
              }}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
              disabled={index === commissionDetails.length - 1}
              onClick={() => {
                dispatch(changeCommissionDetailOrder({ from: index, to: index + 1 }));
              }}
            />
          </div>
        );
      },
      width: 50,
      fixed: 'left',
    },
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 50,
      fixed: 'left',
    },
    {
      title: 'Commission Type',
      dataIndex: 'type',
      key: 'type',
      render: (_, record, index) => {
        return (
          <Form.Item
            className="m-0"
            name={['commission_type', index]}
            initialValue={record.type ?? undefined}
            rules={[
              {
                required: true,
                message: 'Commission type is required',
              },
            ]}>
            <Select
              className="w-full"
              options={[
                {
                  value: 'Other',
                  label: 'Other',
                },
              ]}
              onChange={(selected) =>
                dispatch(
                  changeCommissionDetailValue({
                    index,
                    key: 'type',
                    value: selected,
                  }),
                )
              }
            />
          </Form.Item>
        );
      },
      width: 120,
    },
    {
      title: 'Commission Agent',
      dataIndex: 'commission_agent_id',
      key: 'commission_agent_id',
      render: (_, record, index) => {
        return (
          <Form.Item
            className="m-0"
            name={['commission_agent_id', index]}
            initialValue={record.commission_agent_id ?? undefined}
            rules={[
              {
                required: true,
                message: 'Commission Agent is required',
              },
            ]}>
            <AsyncSelect
              endpoint="/commission-agent"
              valueKey="commission_agent_id"
              labelKey="name"
              labelInValue
              className="w-full"
              onChange={(selected) =>
                dispatch(
                  changeCommissionDetailValue({
                    index,
                    key: 'commission_agent_id',
                    value: selected,
                  }),
                )
              }
              addNewLink={permissions.commission_agent.add ? '/commission-agent/create' : null}
            />
          </Form.Item>
        );
      },
      width: 240,
    },
    {
      title: 'Commission %',
      dataIndex: 'commission_percentage',
      key: 'commission_percentage',
      render: (_, record, index) => {
        return (
          <Form.Item
            className="m-0"
            name={['commission_percentage', index]}
            initialValue={record.commission_percentage ?? undefined}
            rules={[
              {
                required: true,
                message: 'Commission percentage is required',
              },
            ]}>
            <DebouncedNumberInput
              type="decimal"
              onChange={(value) =>
                dispatch(
                  changeCommissionDetailValue({
                    index,
                    key: 'commission_percentage',
                    value: value,
                  }),
                )
              }
            />
          </Form.Item>
        );
      },
      width: 140,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record, index) => {
        return (
          <Form.Item
            className="m-0"
            name={['status', index]}
            initialValue={record.status ?? undefined}
            rules={[
              {
                required: true,
                message: 'Status is required',
              },
            ]}>
            <Select
              className="w-full"
              options={[
                {
                  value: 'Active',
                  label: 'Active',
                },
                {
                  value: 'Inactive',
                  label: 'In Active',
                },
              ]}
              onChange={(selected) =>
                dispatch(
                  changeCommissionDetailValue({
                    index,
                    key: 'status',
                    value: selected,
                  }),
                )
              }
            />
          </Form.Item>
        );
      },
      width: 120,
    },
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addCommissionDetail())}
        />
      ),
      key: 'action',
      render: (record, { id }, index) => {
        return (
          <Dropdown
            trigger={['click']}
            arrow
            menu={{
              items: [
                {
                  key: '1',
                  label: 'Add',
                  onClick: () => dispatch(addCommissionDetail(index)),
                },
                {
                  key: '2',
                  label: 'Copy',
                  onClick: () => dispatch(copyCommissionDetail(index)),
                },
                {
                  key: '3',
                  label: 'Delete',
                  danger: true,
                  onClick: () => dispatch(removeCommissionDetail(id)),
                },
              ],
            }}>
            <Button size="small">
              <BsThreeDotsVertical />
            </Button>
          </Dropdown>
        );
      },
      width: 50,
      fixed: 'right',
    },
  ];

  const onVesselChange = async (vesselID) => {
    dispatch(resetCommissionDetails());
    if (!vesselID) {
      return;
    }

    try {
      await dispatch(getVessel(vesselID)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const updateDetails = async () => {
    try {
      await form.validateFields();
      const vesselID = form.getFieldValue('vessel_id');

      const payload = {
        vessel_commission_agent: commissionDetails.map((detail) => ({
          ...detail,
          vessel_commission_agent_id: detail.row_status === 'I' ? null : detail.id,
          commission_agent_id: detail?.commission_agent_id?.value || null,
        })),
      };

      await dispatch(updateVesselAgent({ id: vesselID, data: payload })).unwrap();
      toast.success('Vessel Agent updated successfully');
      await dispatch(getVessel(vesselID)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(resetCommissionDetails());
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>VESSEL AGENT</PageHeading>
        <Breadcrumb items={[{ title: 'Vessel Agent' }, { title: 'Update' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-4">
        <Form name="vessel-agent" autoComplete="off" layout="vertical" form={form}>
          <Form.Item name="vessel_id" label="Vessel">
            <AsyncSelect
              endpoint="/vessel"
              valueKey="vessel_id"
              labelKey="name"
              className="w-full sm:max-w-[300px]"
              required
              placeholder="Select Vessel"
              onChange={(value) => onVesselChange(value)}
            />
          </Form.Item>

          <Table
            columns={columns}
            dataSource={commissionDetails}
            rowClassName={(record) => (record.isDeleted ? 'hidden-row' : '')}
            rowKey={'id'}
            size="small"
            loading={isItemLoading}
            scroll={{ x: 'calc(100% - 200px)' }}
            pagination={false}
            sticky={{
              offsetHeader: 56,
            }}
          />

          <div className="mt-4 flex justify-end">
            <Button
              type="primary"
              htmlType="button"
              loading={isFormSubmitting}
              disabled={isItemLoading}
              onClick={updateDetails}>
              Save
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default VesselAgent;
