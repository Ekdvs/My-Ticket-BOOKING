import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// Auth Pages
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import ForgotPassword from "../pages/user/ForgotPassword";
import VerifyForgotOTP from "../pages/user/VerifyForgotOTP";
import ResetPassword from "../pages/user/ResetPassword";

// Dashboards
import UserDashboard from "../pages/user/UserDashboard";
import AdminDashboard from "../pages/admin/AdminDashbord";
import OrganizerDashboard from "../pages/organizer/OrganizerDashboard";

// Main Pages
import HomePage from "../pages/pages/Home";
import Privacy from "../pages/pages/Privacy";
import Terms from "../pages/pages/Terms";
import Cookies from "../pages/pages/Cookies";

// Support
import FAQ from "../pages/pages/FAQ";
import Contact from "../pages/pages/ContactUs";


// Company
import About from "../pages/pages/About";
import { Careers } from "../pages/pages/Careers";
import Blog from "../pages/pages/Blog";
import PressKit from "../pages/pages/PressKit";
import HelpCenter from "../pages/pages/HelpCenter";
import Report from "../pages/pages/Report";
import Accessibility from "../pages/pages/Accessibility";
import VerifyEmail from "../pages/user/VerifyEmail";




// Account


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Home
      { path: "/", element: <HomePage /> },

      // Auth
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/verify-forgot-otp", element: <VerifyForgotOTP /> },
      { path: "/reset-password", element: <ResetPassword /> },

      // Dashboards
      { path: "/dashboard", element: <UserDashboard /> },
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/organizer", element: <OrganizerDashboard /> },

      // Legal
      { path: "/privacy", element: <Privacy /> },
      { path: "/terms", element: <Terms /> },
      { path: "/cookies", element: <Cookies /> },

      // Support
      { path: "/faq", element: <FAQ /> },
      { path: "/contact", element: <Contact /> },
      { path: "/help", element: <HelpCenter /> },
      { path: "/report", element: <Report /> },
      { path: "/accessibility", element: <Accessibility /> },

      // Company
      { path: "/about", element: <About /> },
      { path: "/careers", element: <Careers /> },
     { path: "/blog", element: <Blog /> },
     { path: "/press", element: <PressKit /> },
     {path: "/verify-email/:token", element: <VerifyEmail />}

      
    ],
  },
]);

export default router;