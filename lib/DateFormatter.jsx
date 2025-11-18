import { format } from "date-fns/format";
const DateFormatter = ({ date }) => {
  const formattedDate = format(date, "MMM dd, yyyy");

  return <span className="text-gray-700 font-bold">{formattedDate}</span>;
};

export default DateFormatter;
