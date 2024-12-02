const DashboardCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-md shadow-sm p-6 px-4 w-full">
      <div className="flex items-center space-x-4">
        <div className="bg-purple-100 p-3 rounded-full">{icon}</div>
        <div>
          <p className="text-gray-800 text-lg font-semibold">{value}</p>
          <h2 className="text-gray-500 text-sm">{title}</h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
