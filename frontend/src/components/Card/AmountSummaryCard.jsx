const AmountSummaryCard = ({ title, value }) => {
  return (
    <div className="bg-white shadow-sm rounded-md p-4 flex justify-between items-center w-full border border-gray-200">
      <span className="text-gray-500 text-xs">{title}</span>
      <span className="text-gray-800 font-semibold bg-gray-100 min-w-20 text-right px-2 py-1 rounded-md border text-xs overflow-auto hide-scroll">
        {value || "0"}
      </span>
    </div>
  );
};

export default AmountSummaryCard;
