import { GiShipWheel } from "react-icons/gi";

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-8.5rem)] text-primary">
      <div>
        <h1 className="text-xl md:text-3xl font-bold flex items-center">
          L
          <GiShipWheel className="animate-spin mx-.5" size={30} />
          ading . . .
        </h1>
      </div>
    </div>
  );
};

export default PageLoader;
