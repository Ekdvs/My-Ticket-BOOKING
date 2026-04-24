
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/user/Login";

const router = createBrowserRouter(
    [
        {
            path:"/",
            element:<App />,
            children:[
                {path:"/login", element:<Login/>},
            ]
        }
    ]
)

export default router;