import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const DailyRevenueChart = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    Axios.get(SummaryApi.admin_daily_revenue.url).then((res) => {
      const formatted = (res.data.data || []).map((item: any) => ({
        label: item.label,
        amount: Number(item.amount || 0),
      }));
      setData(formatted);
    });
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        📊 Daily Revenue
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyRevenueChart;