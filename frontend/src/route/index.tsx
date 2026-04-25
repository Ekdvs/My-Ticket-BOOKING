
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import ForgotPassword from "../pages/user/ForgotPassword";
import VerifyForgotOTP from "../pages/user/VerifyForgotOTP";
import ResetPassword from "../pages/user/ResetPassword";

const router = createBrowserRouter(
    [
        {
            path:"/",
            element:<App />,
            children:[
                {path:"/login", element:<Login/>},
                {path:"/register", element:<Register/>},
                {path:"/forgot", element:<ForgotPassword/>},
                {path:"/verify-forgot-otp", element:<VerifyForgotOTP/>},
                {path:"/reset-password", element:<ResetPassword/>}
            
            ]
        }
    ]
)

export default router;