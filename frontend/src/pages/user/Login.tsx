import React, { use, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Axios from '../../utils/Axios';
import SummaryApi from '../../api/SummaryApi';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';



const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const validate = () => {
        const { email, password } = formData;
        if (!email || !password) {
            toast.error("Please fill all the fields");
            return false;
        }
        return true;
    }

    //after login redirect
    const redirectAfterLogin = () => {
        const redirectData = JSON.parse(sessionStorage.getItem("redirectAfterLogin") || "null");
        if (redirectData) {
            navigate(redirectData.path, { state: redirectData.state });
            sessionStorage.removeItem("redirectAfterLogin");
        } else {
            navigate("/dashboard");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await Axios(
                {
                    method: SummaryApi.login.method,
                    url: SummaryApi.login.url,
                    data: {
                        email: formData.email,
                        password: formData.password,
                    },
                    withCredentials: true,
                }

            )
            console.log(res.data);

            if (res.data.success) {
                toast.success(res.data.message);

                const role = res.data.data.role;

                // ✅ Save tokens (important)
                localStorage.setItem("accessToken", res.data.data.accessToken);
                localStorage.setItem("refreshToken", res.data.data.refreshToken);

                // ✅ Role-based navigation
                if (role === "ADMIN") {
                    navigate("/admin");
                } else {
                    redirectAfterLogin();
                }

                setLoading(false);
            }
            else {
                toast.error(res.data.message || "Failed to login");
                setLoading(false);
            }

        } catch (error: any) {
            
            const message =
                error?.response?.data?.message ||
                "Failed to login";

            toast.error(message); 
            setLoading(false);
        }

    }

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
                localStorage.setItem(
                    "accessToken",
                    backendResponse.data.data.accessToken
                );
                localStorage.setItem(
                    "refreshToken",
                    backendResponse.data.data.refreshToken
                );

                // ✅ set default header
                Axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${backendResponse.data.data.accessToken}`;

                toast.success(backendResponse.data.message);

                redirectAfterLogin();
            } else {
                toast.error(backendResponse.data.message);
            }
        } catch (error: any) {
            const msg =
                error?.response?.data?.message ||
                "Google login failed";

            toast.error(msg);
        }
    },

    onError: () => {
        toast.error("Google login failed");
    },
});


    return (
        <div className="w-full h-screen bg-[url('/bglogin.png')] bg-cover flex items-center justify-center">
            {/*Left SSection */}
            <div className="hidden lg:flex w-[50%] h-full flex-col items-center justify-center gap-8 bg-purple-600/50 p-10">

                {/* Logo */}
                <img
                    src="/logo.png"
                    alt="logo"
                    className="w-[160px] h-[160px] object-contain opacity-95 drop-shadow-lg bg-blue-800/50"
                />

                {/* Title */}
                <h1 className="text-5xl font-bold text-[#FFD700] text-center drop-shadow-lg leading-tight">
                    Book Tickets Instantly & Effortlessly
                </h1>

                {/* Subtitle */}
                <p className="text-gray-200 text-lg w-[420px] text-center italic">
                    Discover events, reserve seats, and get instant digital tickets — all in one place.
                </p>

                {/* Feature highlights */}
                <div className="flex flex-col gap-3 text-gray-100 text-sm text-center">
                    <p>✔ Instant booking confirmation</p>
                    <p>✔ Secure online payments</p>
                    <p>✔ QR-based digital tickets</p>
                </div>

                {/* CTA buttons */}
                <div className="flex gap-4 mt-4">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold shadow-lg transition">
                        Explore Events
                    </button>

                    <button className="border border-yellow-400 text-yellow-300 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition">
                        Learn More
                    </button>
                </div>

            </div>
            {/*Left SSection */}
            <div className="w-full lg:w-[50%] h-full bg-purple-600/50 flex items-center justify-center">
                <div className="w-[90%] max-w-[550px] bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-8 p-8">
                    <h1 className="text-3xl font-semibold text-[#FFD700] text-center">Welcome Back</h1>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
                        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-[80%] h-[50px] rounded-lg p-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]" />
                        <div className="relative w-[80%]">
                            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full h-[50px] rounded-lg p-3 pr-12 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]" />
                            <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-3 top-3 text-gray-400 hover:text-[#FFD700]">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                        </div>
                        <div className="w-[80%] flex justify-between text-sm text-gray-300">
                            <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#FFD700]" /> Remember Me</label>
                            <Link to="/forgot" className="text-[#FFD700] hover:underline">Forgot Password?</Link>
                        </div>
                        <button type="submit" disabled={loading} className="flex items-center justify-center gap-3 w-[80%] py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold shadow-md"><LogIn size={20} /> {loading ? "Logging in..." : "Login"}</button>
                        <div className="flex items-center w-[80%] gap-2 mt-4">
                            <div className="flex-1 h-[2px] bg-gray-600"></div>
                            <p className="text-gray-400 text-sm">or</p>
                            <div className="flex-1 h-[2px] bg-gray-600"></div>
                        </div>
                        <button type="button" onClick={() => googleLogin()} className="flex items-center justify-center gap-3 w-[80%] py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-100"><FcGoogle size={22} /> Continue with Google</button>


                    </form>
                    <p className="text-gray-300 text-sm mt-4">Don’t have an account? <Link to="/register" className="text-[#FFD700] hover:underline">Sign Up</Link></p>

                </div>

            </div>

        </div>
    )
}

export default Login
