import ModeratorRoute from "../components/ModeratorRoute";
import Dashboard from "../pages/adminPages/Dashboard";
import TambahProject from "../pages/adminPages/ManageProjects/CreateProject";
import ManageProject from "../pages/adminPages/ManageProjects/Projects";
import ManageUser from "../pages/adminPages/ManageUsers/Users";
import AdminCreateUser from "../pages/adminPages/ManageUsers/CreateUser";
import AdminBulkCreateUser from "../pages/adminPages/ManageUsers/CreateUser/AdminBulkCreateUser";
import EditUser from "../pages/adminPages/ManageUsers/EditUser";
import AdminEditProject from "../pages/adminPages/ManageProjects/EditProject";
import AlertManagement from "../pages/adminPages/ManageAlerts/Alerts";
import CreateAlertPage from "../pages/adminPages/ManageAlerts/CreateAlert";
import EditAlertPage from "../pages/adminPages/ManageAlerts/EditAlert";
import ProjectDetailPage from "../pages/adminPages/ManageProjects/ProjectDetail";

const adminRoutes = [
  {
    path: "/admin",
    children: [
      {
        index: true,
        element: (
          <ModeratorRoute>
            <Dashboard />
          </ModeratorRoute>
        ),
      },
      {
        path: "upload-projects",
        element: (
          <ModeratorRoute>
            <TambahProject />
          </ModeratorRoute>
        ),
      },
      {
        path: "manage-projects",
        element: (
          <ModeratorRoute>
            <ManageProject />
          </ModeratorRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <ModeratorRoute>
            <ManageUser />
          </ModeratorRoute>
        ),
      },
      {
        path: "manage-alerts",
        element: (
          <ModeratorRoute>
            <AlertManagement />
          </ModeratorRoute>
        ),
      },
      {
        path: "manage-users/add",
        element: (
          <ModeratorRoute>
            <AdminCreateUser />
          </ModeratorRoute>
        ),
      },
      {
        path: "manage-users/bulk-add",
        element: (
          <ModeratorRoute>
            <AdminBulkCreateUser />
          </ModeratorRoute>
        ),
      },
      {
        path: "manage-alerts/add",
        element: (
          <ModeratorRoute>
            <CreateAlertPage />
          </ModeratorRoute>
        ),
      },
      {
        path: "manage-projects/detail/:slug",
        element: (
          <ModeratorRoute>
            <ProjectDetailPage />
          </ModeratorRoute>
        ),
      },
      {
        path: "manage-users/edit/:id",
        element: (
          <ModeratorRoute>
            <EditUser />
          </ModeratorRoute>
        ),
      },
      {
        path: "manage-projects/edit/:slug",
        element: (
          <ModeratorRoute>
            <AdminEditProject />
          </ModeratorRoute>
        ),
      },
      {
        path: "manage-alerts/edit/:id",
        element: (
          <ModeratorRoute>
            <EditAlertPage />
          </ModeratorRoute>
        ),
      },
    ],
  },
];

export default adminRoutes;