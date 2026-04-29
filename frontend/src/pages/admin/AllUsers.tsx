import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import { toast } from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import { ShieldCheck, ShieldAlert, Trash2 } from "lucide-react";

// ================= TYPES =================
type Role = "USER" | "ADMIN" | "ORGANIZER";
type Status = "ACTIVE" | "INACTIVE";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatar?: string;
  mobile?: string;
  role: Role;
  status: Status;
}

// ================= COMPONENT =================
const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // ================= FETCH USERS =================
  const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true);

      const res = await Axios({
        method: SummaryApi.get_all_users.method,
        url: SummaryApi.get_all_users.url,
        withCredentials: true,
      });

      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= CHANGE ROLE =================
  const changeRole = async (user: User): Promise<void> => {
    try {
      const newRole: Role =
        user.role === "ORGANIZER" ? "USER" : "ORGANIZER";

      const res = await Axios({
        method: SummaryApi.role_change.method,
        url: SummaryApi.role_change.url,
        params: {
          email: user.email,
          newRole,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Role updated");
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Role update failed");
    }
  };

  // ================= CHANGE STATUS =================
  const changeStatus = async (user: User): Promise<void> => {
    try {
      const newStatus: Status =
        user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      const res = await Axios({
        method: SummaryApi.status_change.method,
        url: SummaryApi.status_change.url,
        params: {
          email: user.email,
          newStatus: newStatus.toString(),
        },
        withCredentials: true,
      });

      console.log(res.data);

      if (res.data.success) {
        toast.success("Status updated");
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };



  // ================= STYLES =================
  const roleStyles: Record<Role, string> = {
    ADMIN: "bg-green-100 text-green-700",
    ORGANIZER: "bg-yellow-100 text-yellow-700",
    USER: "bg-gray-100 text-gray-700",
  };

  const statusStyles: Record<Status, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-red-100 text-red-700",
  };

  // ================= UI =================
  if (loading) {
    return <p className="text-center mt-10">Loading users...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">
          User Management
        </h1>

        {users.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl shadow-lg border p-5 hover:shadow-xl transition"
              >
                {/* AVATAR + NAME */}
                <div className="flex items-center gap-4 mb-4">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold">
                      {user.firstName?.charAt(0) || "U"}
                    </div>
                  )}

                  <div>
                    <h2 className="font-bold text-slate-800">
                      {user.firstName || ""} {user.lastName || ""}
                    </h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                {/* ROLE */}
                <p className="text-sm mb-2">
                  <b>Role:</b>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${roleStyles[user.role]}`}
                  >
                    {user.role}
                  </span>
                </p>

                {/* STATUS */}
                <p className="text-sm mb-4">
                  <b>Status:</b>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${statusStyles[user.status]}`}
                  >
                    {user.status}
                  </span>
                </p>

                {/* ACTIONS */}
                <div className="flex gap-2 flex-wrap">
                  {/* ROLE BUTTON */}
                  <button
                    onClick={() => changeRole(user)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition"
                  >
                    {user.role === "ADMIN" ? (
                      <ShieldCheck size={18} />
                    ) : (
                      <ShieldAlert size={18} />
                    )}
                    Role
                  </button>

                  {/* STATUS BUTTON */}
                  <button
                     onClick={() => {
                      setSelectedUser(user);
                      setConfirmOpen(true);
                    }}
                    className={`flex-1 py-2 rounded-lg transition ${
                      user.status === "ACTIVE"
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {user.status === "ACTIVE" ? "Block" : "Activate"}
                  </button>

                  {/* DELETE */}
                  <button
                   
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (selectedUser) changeStatus(selectedUser);
          setConfirmOpen(false);
        }}
        title="Active Or Inactive User"
        message="Are you sure you want to Status Change this user?"
      />
    </div>
  );
};

export default AllUsers;