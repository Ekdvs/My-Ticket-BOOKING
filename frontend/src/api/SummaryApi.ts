

export const baseURL = import.meta.env.VITE_API_BASE_URL;

const SummaryApi = {
    register: {
        url: "/auth/register",
        method: "post",
    },
    login: {
        url: "/auth/login",
        method: "post",
    },
    googleLogin: {
        url: "/auth/google-login",
        method: "post",
    },
    forgot_password: (email: string) => ({
        url: `/auth/forgot-password/${email}`,  // ✅ dynamic
        method: "post",
    }),

    verify_forgot_otp: {
        url: "/auth/verify-otp",
        method: "post",
    },
    reset_password:{
        url:"/auth/reset-password",
        method:"put"
    }

}



export default SummaryApi;