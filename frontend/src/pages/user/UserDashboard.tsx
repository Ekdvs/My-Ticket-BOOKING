import { LogOut, Menu, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Axios from '../../utils/Axios';
import SummaryApi from '../../api/SummaryApi';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';


const sidebarItems = [
  { key: "dashboard", label: "Dashboard", icon: User },
  { key: "profile", label: "Profile", icon: User },
]

const UserDashboard = () => {

    const [user, setUser] = useState(null);
    const [activeSection, setActiveSection] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");
    

    // Fetch user data on component mount
    useEffect(() => {
    const fetchUserData = async () => {
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const res = await Axios({
                method: SummaryApi.login_user.method,
                url: SummaryApi.login_user.url,
                
                withCredentials: true,
            });

            

            if (res.data.success) {
                setUser(res.data.data); // FIXED (see below)
                toast.success(res.data.message || "User data fetched successfully");
            } else {
                toast.error("Failed to fetch user data");
                localStorage.removeItem("token");
                navigate("/login");
            }
        } catch (error) {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    fetchUserData(); // 🔥 IMPORTANT
}, [token, navigate]);


// 🔹 Logout
  const handleLogout = async () => {
    try {
      await Axios({
        method: SummaryApi.logout.method,
        url: SummaryApi.logout.url,
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refeshToken");
    localStorage.clear();
    navigate("/login");
  };


  return (
    <div className=" min-h-[calc(100vh-64px)] flex bg-gray-100 mt-[64px] overflow-hidden">
        {/* 🔥 Mobile Header */}
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-red shadow flex items-center justify-between px-4 py-3">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="md:hidden font-semibold">Dashboard</h2>
      </div>

      {/* 🔥 Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-red/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      {/* 🔥 Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0  z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 🔥 Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed md:relative z-10 w-72 min-h-screen bg-yellow-100 shadow-xl p-6"
          >
            {/* Mobile Close */}
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h1 className="text-xl font-bold mt-10 text-blue-600">Dashboard</h1>
              <button className="mt-10"onClick={() => setSidebarOpen(false)}>
                <X />
              </button>
            </div>

            {/* Desktop Title */}
            <h1 className="hidden md:block text-2xl font-bold text-blue-600 mb-8">
              Dashboard
            </h1>

            {/* Menu */}
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.key;

                return (
                  
                  <motion.li
                    key={item.key}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => {
                      setActiveSection(item.key);
                      setSidebarOpen(false);
                    }}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-xl
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-bold"
                          : "text-black  hover:bg-gray-100"
                      }`}
                  >
                    {/* 🔥 Active Indicator Bar */}
                    {isActive && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r"
                      />
                    )}

                    {/* Icon animation */}
                    <motion.div
                      animate={{ rotate: isActive ? 360 : 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Icon size={20} />
                    </motion.div>

                    {item.label}
                  </motion.li>
                );
              })}

              {/* Logout */}
              <motion.li
                whileHover={{ scale: 1.03 }}
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-red-500 hover:bg-red-50"
              >
                <LogOut size={20} />
                Logout
              </motion.li>
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>

        {/* 🔥 Main Content */}
         <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {activeSection === "dashboard" && (
                <div>
                    <h1 className="text-3xl font-bold mb-4">Welcome, </h1>
                    <p className="text-gray-700">This is your dashboard. Here you can view your profile, manage your tickets, and more.</p>
                </div>
            )}
        
         </main>
      
      
    </div>
  )
}

export default UserDashboard
