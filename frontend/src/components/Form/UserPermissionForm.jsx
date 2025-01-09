import { Button, Card, Checkbox, Col, Collapse, Form, Input, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  changeAllSubsection,
  changeCheckbox,
  checkAllSection
} from '../../store/features/userPermissionSlice';

const UserPermissionForm = ({ mode = 'create', onSubmit }) => {
  const dispatch = useDispatch();
  const { permissions, permissionsGroup, initialFormValues, isSubmitting } = useSelector(
    (state) => state.userPermission
  );

  const items = permissions.map((p) => {
    return {
      key: p.name,
      label: p.name,
      children: (
        <div className="flex flex-wrap gap-4">
          {Object.entries(p.value).map(([name, values]) => (
            <Card
              title={name}
              extra={
                <Checkbox
                  checked={Object.values(values).every(
                    ({ permission_id, route }) => permissionsGroup[route][permission_id] === 1
                  )}
                  onClick={() => {
                    const route = p.value[name][0].route;
                    dispatch(changeAllSubsection(route));
                  }}
                />
              }
              className="w-80"
              key={name}
            >
              <Row gutter={16}>
                {Object.values(values).map(({ permission_name, permission_id, route }) => (
                  <Col span={12} key={permission_id}>
                    <Checkbox
                      checked={permissionsGroup[route][permission_id] === 1}
                      onClick={() => dispatch(changeCheckbox({ route, permission_id }))}
                    >
                      {permission_name}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Card>
          ))}
        </div>
      ),
      extra: (
        <Checkbox
          checked={(() => {
            const keys = Object.values(p.value).map((p) => p[0].route);

            const isAllAreChecked = keys.every((route) =>
              Object.values(permissionsGroup[route]).every((v) => v === 1)
            );

            return isAllAreChecked;
          })()}
          onClick={(e) => {
            e.stopPropagation();
            const keys = Object.values(p.value).map((p) => p[0].route);
            dispatch(checkAllSection(keys));
          }}
        />
      )
    };
  });

  return (
    <Form
      name="user"
      onFinish={onSubmit}
      autoComplete="off"
      layout="vertical"
      initialValues={mode === 'edit' ? initialFormValues : {}}
    >
      <Row gutter={16}>
        <Col span={24} md={8} lg={6}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Name is required!'
              }
            ]}
          >
            <Input autoFocus />
          </Form.Item>
        </Col>

        <Col span={24} md={16} lg={18}>
          <Form.Item label="Description" name="description">
            <Input autoFocus />
          </Form.Item>
        </Col>
      </Row>

      <Collapse items={items} defaultActiveKey={permissions[0]?.name} />

      <div className="mt-4 flex justify-end gap-2">
        <Link to="/user-permission">
          <Button htmlType="button" block>
            Cancel
          </Button>
        </Link>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          Save
        </Button>
      </div>
    </Form>
  );
};
export default UserPermissionForm;
