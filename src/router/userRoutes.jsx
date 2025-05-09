import Project from "../pages/userPages/Projects";
import ProjectDetail from '../pages/userPages/Projects/ProjectDetail';
import UserProfile from "../pages/userPages/Profile";
import UploadProject from "../pages/userPages/Projects/UploadProject";
import UserEditProfile from '../pages/userPages/Profile/UserEditProfile';
import CreatorProfile from '../pages/userPages/Profile/CreatorProfile';
import UpdateProject from "../pages/userPages/Projects/EditProject";
import ForgotPassword from "../auth/User/ForgotPassword";

const userRoutes = [
  {
    path: "/projects",
    element: <Project />,
  },
  {
    path: "/project/:slug",
    element: <ProjectDetail />,
  },
  {
    path: "/profile",
    element: <UserProfile />,
  },
  {
    path: "/profile/creator/:username",
    element: <CreatorProfile />,
  },
  {
    path: "/auth/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/settings",
    element: <UserProfile />,
  },
  {
    path: "/upload/project",
    element: <UploadProject />,
  },
  {
    path: "/edit/profile",
    element: <UserEditProfile />,
  },
  {
    path: "/edit/project/:slug",
    element: <UpdateProject />,
  },
];

export default userRoutes;