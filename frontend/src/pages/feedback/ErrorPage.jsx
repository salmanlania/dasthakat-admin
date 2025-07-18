import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const ErrorPage = () => {
  useDocumentTitle('Error Page');
  return (
    <Result
      status="warning"
      title="We're unable to proceed at the moment. Please get in touch with your administrator for support."
      extra={
        <Link to="..">
          <Button type="primary">Try to go back</Button>
        </Link>
      }
    />
  );
};
export default ErrorPage;
