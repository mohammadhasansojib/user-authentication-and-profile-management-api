import { 
  createBrowserRouter,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Reset from "./pages/Reset";
import DataService from "./utils/data_fetch"


const router = createBrowserRouter([
    {
        path: '/',
        children: [
            {index: true, Component: Dashboard},
            {
                path: '/dashboard',
                Component: Dashboard,
            },
            {path: '/register', Component: Register},
            {path: '/login', Component: Login},
            {
                path: '/profile',
                loader: async () => {
                    return {records: await DataService.getHelloWorld()}
                },
                Component: Profile,
            },
            {path: '/reset-password', Component: Reset},
        ]
    }
])

export default router;