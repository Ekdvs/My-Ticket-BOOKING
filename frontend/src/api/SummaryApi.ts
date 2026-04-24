export const baseURL = import.meta.env.VITE_API_BASE_URL;

const SummaryApi = {
    register:{
        url:"/auth/register",
        method:"post",
    },
    login:{
        url:"/auth/login",
        method:"post",
    },
    googleLogin:{
        url:"/auth/google-login",
        method:"post",
    },
}

export default SummaryApi;