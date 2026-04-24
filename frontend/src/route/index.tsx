
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";

const router = createBrowserRouter(
    [
        {
            path:"/",
            element:<App />,
            children:[
                {path:"/login", element:<Login/>},
                {path:"/register", element:<Register/>},
            ]
        }
    ]
)

export default router;