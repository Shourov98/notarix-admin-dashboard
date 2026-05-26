import { createBrowserRouter, Navigate } from "react-router-dom";
import SignIn from "../Pages/Auth/SignIn/SignIn";
import ForgatePassword from "../Pages/Auth/ForgatePassword/ForgatePassword";
import VerifyCode from "../Pages/Auth/VerifyCode/VerifyCode";
import NewPass from "../Pages/Auth/NewPass/NewPass";
import PasswordChanged from "../Pages/Auth/PasswordChanged/PasswordChanged";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "../admin/layout/AdminLayout";
import DashboardPage from "../admin/pages/DashboardPage";
import UserManagementPage from "../admin/pages/UserManagementPage";
import UserFormPage from "../admin/pages/UserFormPage";
import UserProfilePage from "../admin/pages/UserProfilePage";
import OrderManagementPage from "../admin/pages/OrderManagementPage";
import OrderDetailsPage from "../admin/pages/OrderDetailsPage";
import RonOrderPage from "../admin/pages/RonOrderPage";
import DocumentsPage from "../admin/pages/DocumentsPage";
import PaymentsPage from "../admin/pages/PaymentsPage";
import MessagesPage from "../admin/pages/MessagesPage";
import ReportsPage from "../admin/pages/ReportsPage";
import SettingsPage from "../admin/pages/SettingsPage";
import SupportPage from "../admin/pages/SupportPage";

export const router = createBrowserRouter([
  { path: "/sign-in", element: <SignIn /> },
  { path: "/forgate-password", element: <ForgatePassword /> },
  { path: "/verify-code", element: <VerifyCode /> },
  { path: "/new-password", element: <NewPass /> },
  { path: "/password-changed", element: <PasswordChanged /> },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "users", element: <UserManagementPage /> },
          { path: "users/new", element: <UserFormPage /> },
          { path: "users/client/:id", element: <UserProfilePage type="client" /> },
          { path: "users/client/:id/documents", element: <UserProfilePage type="client" /> },
          { path: "users/notary/:id", element: <UserProfilePage type="notary" /> },
          { path: "users/notary/:id/documents", element: <UserProfilePage type="notary" /> },
          { path: "orders", element: <OrderManagementPage /> },
          { path: "orders/pending", element: <OrderDetailsPage variant="pending" /> },
          { path: "orders/assigned", element: <OrderDetailsPage variant="assigned" /> },
          { path: "orders/completed", element: <OrderDetailsPage variant="completed" /> },
          { path: "orders/ron-session", element: <RonOrderPage /> },
          { path: "documents", element: <DocumentsPage /> },
          { path: "payments", element: <PaymentsPage /> },
          { path: "messages", element: <MessagesPage /> },
          { path: "reports", element: <ReportsPage /> },
          { path: "support", element: <SupportPage /> },
          { path: "support/:id", element: <SupportPage detail /> },
          { path: "settings", element: <Navigate to="/settings/profile" replace /> },
          { path: "settings/profile", element: <SettingsPage section="profile" /> },
          { path: "settings/company", element: <SettingsPage section="company" /> },
          { path: "settings/notifications", element: <SettingsPage section="notifications" /> },
          { path: "settings/security", element: <SettingsPage section="security" /> },
          { path: "settings/admins", element: <SettingsPage section="admins" /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);
