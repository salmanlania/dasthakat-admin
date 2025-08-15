/* eslint-disable react/prop-types */
import { Button, Col, Form, Input, Row, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCoaLevelOne, getCoaLevelOneCode } from '../../store/features/coaOneSlice';
import AsyncSelectLedger from '../AsyncSelectLedger';
import DebounceInput from '../Input/DebounceInput';

const CoaLevelOneForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, coaLevelOneList, initialFormCodeValues } = useSelector(
    (state) => state.coaOne
  );

  const [submitAction, setSubmitAction] = useState(null);

  const onFinish = (values) => {

    const data = {
      gl_type_id: values?.gl_types?.value ? values?.gl_types?.value : null,
      level1_code: values?.code ? values?.code : null,
      name: values?.coa_name ? values?.coa_name : null,
    };

    submitAction === 'save' ? onSubmit(data) : submitAction === 'saveAndExit' ? onSave(data) : null;
  };

  useEffect(() => {
    if (mode === 'edit' && initialFormValues) {
      const gl_types = initialFormValues?.gl_types || '';
      const gl_type_id = initialFormValues?.gl_type_id || '';
      const code = initialFormValues?.code || '';
      const coa_name = initialFormValues?.coa_name || '';
      form.setFieldsValue({
        // gl_types: gl_types,
        gl_types: gl_type_id
          ? { value: gl_type_id, label: gl_types }
          : undefined,
        code: code,
        coa_name: coa_name,
      });

      if (gl_type_id) {
        dispatch(getCoaLevelOne({ gl_type_id: gl_type_id }));
      }
    } else if (mode !== 'edit' && initialFormCodeValues) {
      form.setFieldsValue({
        code: initialFormCodeValues?.code
      });
    }
  }, [initialFormValues, initialFormCodeValues, form, mode]);

  const columns = [
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 20
    },
    {
      title: 'Account Type',
      dataIndex: 'gl_type',
      key: 'gl_type',
      render: (_, record, index) => {
        return (
          <DebounceInput
            disabled
            value={record?.gl_type}
          />
        );
      },
      width: 140
    },
    {
      title: 'Code',
      dataIndex: 'level1_code',
      key: 'level1_code',
      render: (_, record, { product_id }, index) => {
        return (
          <Input value={record.level1_code} disabled />
        );
      },
      width: 100
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record, { product_id }, index) => {
        return (
          <Input value={record.name} disabled />
        );
      },
      width: 280
    },
  ];

  return (
    <>
      <Form
        name="coaOne"
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        initialValues={
          mode === 'edit'
            ? {
              ...initialFormValues
            }
            : { document_date: dayjs() }
        }
        scrollToFirstError>

        <Row gutter={12}>
          <Col span={24} sm={12} md={8} lg={8}>
            <Form.Item name="gl_types" label="Account Type">
              <AsyncSelectLedger
                endpoint="/lookups/gl-types"
                valueKey="gl_type_id"
                disabled={mode === 'edit' ? true : false}
                labelKey="name"
                labelInValue
                className="w-full"
                onChange={(selected) => {
                  if (selected?.value) {
                    dispatch(getCoaLevelOne({ gl_type_id: selected.value }));
                    if (mode !== 'edit') {
                      dispatch(getCoaLevelOneCode(
                        {
                          gl_type_id: selected.value,
                          level: 1,
                          coa_level2_id: null,
                          coa_level1_id: null
                        }
                      ));
                    }
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={4} lg={4}>
            <Form.Item name="code" label="Code">
              <Input required disabled={mode === 'edit' ? true : false} type="number"inputMode="numeric" />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item name="coa_name" label="Name">
              <Input required />
            </Form.Item>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={Array.isArray(coaLevelOneList) ? coaLevelOneList : []}
          rowKey={'coa_level1_id'}
          size="small"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={false}
          sticky={{
            offsetHeader: 56
          }}
        />

        <div className="mt-4 flex items-center justify-end gap-2">
          <Link to="/general-ledger/coa/level1">
            <Button className="w-28">Exit</Button>
          </Link>

          <Button
            type="primary"
            className="w-28"
            loading={isFormSubmitting && submitAction === 'save'}
            onClick={() => {
              setSubmitAction('save');
              form.submit()
            }}>
            Save
          </Button>

          <Button
            type="primary"
            className="w-28 bg-green-600 hover:!bg-green-500"
            loading={isFormSubmitting && submitAction === 'saveAndExit'}
            onClick={() => {
              setSubmitAction('saveAndExit');
              form.submit()
            }}>
            Save & Exit
          </Button>

        </div>
      </Form>
    </>
  );
};

export default CoaLevelOneForm;