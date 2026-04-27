import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const MonthlyRevenueChart = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    Axios.get(SummaryApi.admin_monthly_revenue.url).then((res) => {
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
        📈 Monthly Revenue
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#22c55e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyRevenueChart;