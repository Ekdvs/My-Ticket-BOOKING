import React, { useState } from "react";
import toast from "react-hot-toast";
import SummaryApi from "../../api/SummaryApi";
import Axios from "../../utils/Axios";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}

const Register: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Password strength validator
    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 6) return "At least 6 characters required";
        if (!/[A-Z]/.test(pwd)) return "One uppercase letter required";
        if (!/[0-9]/.test(pwd)) return "One number required";
        if (!/[!@#$%^&*]/.test(pwd)) return "One special character required";
        return null;
    };

    // ✅ Validation
    const validate = () => {
        const { email, password, confirmPassword, firstName, lastName } = formData;

        if (!email || !password || !confirmPassword || !firstName || !lastName) {
            toast.error("Please fill all the fields");
            return false;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            toast.error(passwordError);
            return false;
        }

        if (password !== confirmPassword) {
            toast.error("Password and confirm password should be same");
            return false;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error("Please enter a valid email");
            return false;
        }

        if (!/^[a-zA-Z]+$/.test(firstName)) {
            toast.error("First name should contain only letters");
            return false;
        }

        if (!/^[a-zA-Z]+$/.test(lastName)) {
            toast.error("Last name should contain only letters");
            return false;
        }

        return true;
    };

    // ✅ Google login
    const googleLogin = useGoogleLogin({
        flow: "implicit",
        onSuccess: async (response) => {
            try {
                const backendResponse = await Axios({
                    method: SummaryApi.googleLogin.method,
                    url: SummaryApi.googleLogin.url,
                    data: {
                        access_token: response.access_token,
                    },
                    withCredentials: true,
                });

                if (backendResponse.data.success) {
                    localStorage.setItem("accessToken", backendResponse.data.data.accessToken);
                    localStorage.setItem("refreshToken", backendResponse.data.data.refreshToken);

                    Axios.defaults.headers.common["Authorization"] = `Bearer ${backendResponse.data.data.accessToken}`;

                    toast.success(backendResponse.data.message);
                    const role = backendResponse.data.data.role;
                    if (role === "ADMIN") {
                        navigate("/admin");
                    } else if (role === "ORGANIZER") {
                        navigate("/organizer");
                    } else {
                        navigate("/dashboard");
                    }
                } else {
                    toast.error(backendResponse.data.message);
                }
            } catch (error: any) {
                const msg = error?.response?.data?.message || "Google login failed";
                toast.error(msg);
            }
        },
        onError: () => {
            toast.error("Google login failed");
        },
    });

    // ✅ Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const res = await Axios({
                method: SummaryApi.register.method,
                url: SummaryApi.register.url,
                data: {
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || "Failed to register";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="w-full h-screen bg-[url('/bglogin.png')] bg-cover bg-center flex items-center justify-center">
                {/* Left Section */}
                <div className="hidden lg:flex w-[50%] h-full flex-col items-center justify-center gap-8 bg-purple-600/50 p-10 text-center">
                    <img
                        src="/logo.png"
                        alt="Ticket Booking Logo"
                        className="w-[160px] h-[160px] opacity-90 drop-shadow-lg"
                    />
                    <h1 className="text-4xl lg:text-5xl font-bold text-[#FFD700] leading-tight">
                        Book Tickets Instantly
                    </h1>
                    <p className="text-gray-200 text-lg max-w-[420px] italic">
                        Discover movies, events, and experiences near you.
                        Fast booking, secure payments, and zero hassle.
                    </p>
                    <Link to="/login">
                        <button className="px-8 py-3 bg-[#FFD700] text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
                            Already have an account? Login
                        </button>
                    </Link>
                </div>

                {/* Right Section */}
                <div className="w-full lg:w-[50%] h-full bg-purple-600/50 flex items-center justify-center">
                    <div className="w-[95%] max-w-[550px] backdrop-blur-md rounded-2xl shadow-2xl flex flex-col items-center gap-8 p-8">
                        <h1 className="text-3xl font-semibold text-[#FFD700]">Create Your Account</h1>
                        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-2">

                            {/* First Name */}
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-[80%] h-[50px] rounded-lg p-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                            />

                            {/* Last Name */}
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-[80%] h-[50px] rounded-lg p-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                            />

                            {/* Email */}
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-[80%] h-[50px] rounded-lg p-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                            />

                            {/* Password */}
                            <div className="relative w-[80%]">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full h-[50px] rounded-lg p-3 pr-12 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-[#FFD700]"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Live password hint */}
                            {formData.password && validatePassword(formData.password) && (
                                <p className="w-[80%] text-xs text-red-400 -mt-1">
                                    {validatePassword(formData.password)}
                                </p>
                            )}

                            {/* Confirm Password */}
                            <div className="relative w-[80%]">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full h-[50px] rounded-lg p-3 pr-12 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-[#FFD700]"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center gap-3 w-[80%] py-3 mt-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold shadow-md hover:opacity-90"
                            >
                                <UserPlus size={20} />
                                {loading ? "Creating account..." : "Register"}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center w-[80%] gap-2 mt-4">
                                <div className="flex-1 h-[2px] bg-gray-600"></div>
                                <p className="text-gray-400 text-sm">or</p>
                                <div className="flex-1 h-[2px] bg-gray-600"></div>
                            </div>

                            {/* Google */}
                            <button
                                type="button"
                                onClick={() => googleLogin()}
                                className="flex items-center justify-center gap-3 w-[80%] py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-100"
                            >
                                <FcGoogle size={22} /> Continue with Google
                            </button>
                        </form>

                        <p className="text-gray-300 text-sm mt-4">
                            Already have an account?{" "}
                            <Link to="/login" className="text-[#FFD700] hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Register;