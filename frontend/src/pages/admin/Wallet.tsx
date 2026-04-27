import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import toast from "react-hot-toast";

const Wallet = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    const res = await Axios.get(SummaryApi.organizer_wallet.url);
    setWallet(res.data.data);
  };

  const withdraw = async () => {
    try {
      const res =await Axios.post(SummaryApi.withdraw_request.url, {
        amount: Number(amount),
      });

      console.log("kkkkkkkkkkkk",res.data);

      toast.success("Withdraw request sent");
      setAmount("");
      fetchWallet();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-700">💼 Wallet</h2>

      <div className="bg-indigo-50 p-4 rounded-xl">
        <p className="text-gray-600">Available Balance</p>
        <p className="text-2xl font-bold text-indigo-600">
          Rs {wallet?.balance || 0}
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter amount"
        />

        <button
          onClick={withdraw}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-xl transition"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default Wallet;