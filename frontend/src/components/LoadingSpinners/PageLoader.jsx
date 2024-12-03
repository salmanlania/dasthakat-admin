import { Spin } from "antd";

const PageLoader = () => {
  return (
    <div className="h-[calc(100vh-6.5rem)] w-full flex items-center justify-center">
      <Spin size="large" />
    </div>
  );
};

export default PageLoader;
