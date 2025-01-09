// eslint-disable-next-line react/prop-types
const DashboardCard = ({ title, value, icon }) => {
  return (
    <div className="w-full rounded-md bg-white p-6 px-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-purple-100 p-3">{icon}</div>
        <div>
          <p className="text-lg font-semibold text-gray-800">{value}</p>
          <h2 className="text-sm text-gray-500">{title}</h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
