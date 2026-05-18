import { createBrowserRouter } from "react-router";

import { NotFound } from "@/pages/404/NotFound";

import publicRoutes from "./public.routes";
import { employeeRoutes } from "./employee.routes";
import { employerRoutes } from "./employer.routes";

export const router = createBrowserRouter([
  ...publicRoutes,
  ...employeeRoutes,
  ...employerRoutes,
  {
    path: "*",
    element: <NotFound />,
  },
]);
