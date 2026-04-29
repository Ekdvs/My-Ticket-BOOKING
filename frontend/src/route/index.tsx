
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import ForgotPassword from "../pages/user/ForgotPassword";
import VerifyForgotOTP from "../pages/user/VerifyForgotOTP";
import ResetPassword from "../pages/user/ResetPassword";
import UserDashboard from "../pages/user/UserDashboard";
import AdminDashboard from "../pages/admin/AdminDashbord";
import OrganizerDashboard from "../pages/organizer/OrganizerDashboard";
import HomePage from "../pages/pages/Home";


const router = createBrowserRouter(
    [
        {
            path:"/",
            element:<App />,
            children:[
                {path:"/login", element:<Login/>},
                {path:"/register", element:<Register/>},
                {path:"/forgot-password", element:<ForgotPassword/>},
                {path:"/verify-forgot-otp", element:<VerifyForgotOTP/>},
                {path:"/reset-password", element:<ResetPassword/>},
                {path:"/dashboard", element:<UserDashboard/>},
                {path:"/admin", element:<AdminDashboard/>},
                {path:"/organizer", element:<OrganizerDashboard/>},
                {path:"/",element:<HomePage/>}
            
            ]
        }
    ]
)

export default router;