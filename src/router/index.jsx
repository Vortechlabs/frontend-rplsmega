import { createBrowserRouter } from "react-router-dom";
import publicRoutes from "./publicRoutes";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import adminRoutes from "./adminRoutes";
import Error404 from "../pages/errorpages/404";

const router = createBrowserRouter([
  ...publicRoutes,
  ...authRoutes,
  ...userRoutes,
  ...adminRoutes,
  {
    path: "*",
    element: <Error404 />,
  }
]);

export default router;