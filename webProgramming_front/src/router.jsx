import { createBrowserRouter } from "react-router-dom";

import App from "./App";

import NotFoundError from "./pages/error/NotFound";
import Mypage from "./pages/Auth/Mypage";
import Login from "./pages/Auth/Login";
import Main from "./pages/main/Main";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Main />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "mypage",
                element: <Mypage />,
            },
        ],
        errorElement: <NotFoundError />,
    },
]);

export default router;
