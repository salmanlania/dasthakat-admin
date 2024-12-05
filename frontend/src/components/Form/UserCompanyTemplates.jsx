import { Card, Checkbox, Col, Collapse, Row } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAllCompanyTemplates,
  changeTemplateItem,
  getCompanyTemplatesHandler,
} from "../../store/features/userSlice.js";
import useError from "../../hooks/useError.jsx";

const UserCompanyTemplates = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { templates, selectedTemplates } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getCompanyTemplatesHandler()).unwrap().catch(handleError);
  }, []);

  const isCheckAll = (companyID) => {
    const totalCompaniesLength = templates.find(
      (t) => t.company_id === companyID
    ).branches.length;
    const selectedCompaniesLength = selectedTemplates.filter(
      (t) => t.company_id === companyID
    ).length;

    return totalCompaniesLength === selectedCompaniesLength;
  };

  const items = [
    {
      key: "1",
      label: "Company and Branches",
      children: (
        <Row gutter={[16, 16]}>
          {templates.map((company) => (
            <Col span={24} md={12} key={company.company_id}>
              <Card
                title={company.company_name}
                extra={
                  <Checkbox
                    checked={isCheckAll(company.company_id)}
                    onChange={(e) =>
                      dispatch(
                        changeAllCompanyTemplates({
                          value: e.target.checked,
                          companyID: company.company_id,
                        })
                      )
                    }
                  />
                }
                className="h-40 overflow-y-auto"
              >
                <Row gutter={16}>
                  {company.branches.map((template) => (
                    <Col span={12} key={template.branch_id}>
                      <Checkbox
                        checked={selectedTemplates.find(
                          (t) =>
                            t.branch_id === template.branch_id &&
                            t.company_id === company.company_id
                        )}
                        onChange={(e) =>
                          dispatch(
                            changeTemplateItem({
                              value: e.target.checked,
                              companyID: company.company_id,
                              templateID: template.branch_id,
                            })
                          )
                        }
                      >
                        {template.branch_name}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      ),
    },
  ];

  return <Collapse items={items} />;
};
export default UserCompanyTemplates;
