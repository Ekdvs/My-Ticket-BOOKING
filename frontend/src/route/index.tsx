
import { createBrowserRouter } from "react-router-dom";
import App from "../App";

const router = createBrowserRouter(
    [
        {
            path:"/",
            element:<App />,
            children:[
                {path:"/login", element:<div>Login</div>},
            ]
        }
    ]
)

export default router;