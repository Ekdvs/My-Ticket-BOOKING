import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import toast from "react-hot-toast";

const WithdrawAdmin = () => {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await Axios.get(SummaryApi.admin_withdraw_list.url);
    setList(res.data.data);
  };

  const approve = async (id: string) => {
    await Axios.patch(SummaryApi.admin_approve_withdraw(id).url);
    toast.success("Approved");
    fetchData();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h2 className="text-lg font-bold text-gray-700 mb-4">
        💰 Withdraw Requests
      </h2>

      <div className="space-y-3">
        {list.map((w: any) => (
          <div
            key={w.id}
            className="flex items-center justify-between p-4 border rounded-xl hover:shadow transition"
          >
            <div>
              <p className="font-semibold">Rs {w.amount}</p>
              <p className="text-sm text-gray-500">{w.status}</p>
            </div>

            {w.status === "PENDING" && (
              <button
                onClick={() => approve(w.id)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg"
              >
                Approve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WithdrawAdmin;