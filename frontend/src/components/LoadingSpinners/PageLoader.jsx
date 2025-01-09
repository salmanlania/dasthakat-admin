import { GiShipWheel } from 'react-icons/gi';

const PageLoader = () => {
  return (
    <div className="flex h-[calc(100vh-8.5rem)] w-full items-center justify-center text-primary">
      <div>
        <h1 className="flex items-center text-xl font-bold md:text-3xl">
          L
          <GiShipWheel className="mx-.5 animate-spin" size={30} />
          ading . . .
        </h1>
      </div>
    </div>
  );
};

export default PageLoader;
