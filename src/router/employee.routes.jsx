import { requireAuth, requireGuest } from "@/loaders/requireAuth";
import { ROLES } from "@/constants";
import { Outlet } from "react-router";

export const employeeRoutes = [
  {
    path: "/employee",
    children: [
      // 🌐 GUEST ROUTES (not logged in)
      {
        children: [
          {
            path: "sign-in",
            loader: requireGuest,
            async lazy() {
              const { EmployeeSignIn } =
                await import("@/pages/employee/auth/EmployeeSignIn");
              return { Component: EmployeeSignIn };
            },
          },
          {
            path: "register",
            loader: requireGuest,
            async lazy() {
              const { EmployeeRegister } =
                await import("@/pages/employee/auth/EmployeeRegister");
              return { Component: EmployeeRegister };
            },
          },
        ],
      },

      // 🔒 PRIVATE ROUTES (employee only)
      {
        loader: requireAuth({
          allowedRoles: [ROLES.EMPLOYEE],
        }),
        // 📦 Bundled Layout
        async lazy() {
          const { EmployeeDashboardLayout, EmployeeErrorBoundary } =
            await import("@/pages/employee/EmployeeCore");
          return {
            Component: EmployeeDashboardLayout,
            ErrorBoundary: EmployeeErrorBoundary,
          };
        },
        children: [
          {
            index: true,
            // 📦 Bundled Default View (Loads in the exact same network request as the Layout)
            async lazy() {
              const { FindJobs } =
                await import("@/pages/employee/EmployeeCore");
              return { Component: FindJobs };
            },
          },
          {
            path: "find-jobs",
            // 📦 Bundled Default View
            async lazy() {
              const { FindJobs } =
                await import("@/pages/employee/EmployeeCore");
              return { Component: FindJobs };
            },
          },
          {
            path: "my-applications",
            async lazy() {
              const { MyApplications } =
                await import("@/pages/employee/MyApplications");
              return {
                Component: MyApplications,
              };
            },
          },
          {
            path: "score-cards-list",
            async lazy() {
              const { ScoreCardsList } =
                await import("@/pages/employee/ScoreCardsList");
              return { Component: ScoreCardsList };
            },
          },
          {
            path: "scorecard",
            async lazy() {
              const { EmployeeScoreCard } =
                await import("@/pages/employee/EmployeeScoreCard");
              return { Component: EmployeeScoreCard };
            },
          },
          {
            path: "profile",
            async lazy() {
              const { EmployeeProfile } =
                await import("@/pages/employee/EmployeeProfile");
              return { Component: EmployeeProfile };
            },
          },
        ],
      },

      //interview
      {
        path: "interview",
        loader: requireAuth({
          allowedRoles: [ROLES.EMPLOYEE],
        }),
        async lazy() {
          const { EmployeeErrorBoundary } =
            await import("@/pages/employee/EmployeeCore");
          return {
            Component: Outlet,
            ErrorBoundary: EmployeeErrorBoundary,
          };
        },
        children: [
          {
            path: "launch",
            async lazy() {
              const { InterviewLaunch } =
                await import("@/pages/employee/InterviewLaunch");
              return { Component: InterviewLaunch };
            },
          },
        ],
      },
    ],
  },
];
