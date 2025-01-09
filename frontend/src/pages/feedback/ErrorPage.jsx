import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <Result
      status="warning"
      title="Oops! Something went wrong."
      extra={
        <Link to="..">
          <Button type="primary">Try to go back</Button>
        </Link>
      }
    />
  );
};
export default ErrorPage;
