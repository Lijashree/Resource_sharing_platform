import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { AuthLayout } from "./components/layouts/AuthLayout";
import { LoginPage } from "./components/pages/LoginPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { AddItemPage } from "./components/pages/AddItemPage";
import { BrowseItemsPage } from "./components/pages/BrowseItemsPage";
import { RequestsPage } from "./components/pages/RequestsPage";
import { ImpactPage } from "./components/pages/ImpactPage";
import { NGODonationPage } from "./components/pages/NGODonationPage";
import { AdminDashboardPage } from "./components/pages/AdminDashboardPage";
import { DatabaseViewerPage } from "./components/pages/DatabaseViewerPage";
import { ProfilePage } from "./components/pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { index: true, Component: LoginPage },
    ],
  },
  {
    path: "/app",
    Component: RootLayout,
    children: [
      { path: "dashboard", Component: DashboardPage },
      { path: "add-item", Component: AddItemPage },
      { path: "browse", Component: BrowseItemsPage },
      { path: "requests", Component: RequestsPage },
      { path: "impact", Component: ImpactPage },
      { path: "donations", Component: NGODonationPage },
      { path: "profile", Component: ProfilePage },
      { path: "admin", Component: AdminDashboardPage },
      { path: "database", Component: DatabaseViewerPage },
    ],
  },
]);