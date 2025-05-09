import Login from "../auth/User/Login";
import AdminLogin from "../auth/admin/AdminLogin";
import Register from "../auth/User/Register";

const authRoutes = [
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
];

export default authRoutes;