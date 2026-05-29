import { requireAuth, requireGuest } from "@/loaders/requireAuth";
import { ROLES } from "@/constants";

export const employerRoutes = [
  {
    path: "/employer",
    children: [
      // 🌐 GUEST ROUTES (not logged in)
      {
        children: [
          {
            path: "sign-in",
            loader: requireGuest,
            async lazy() {
              const { EmployerSignIn } =
                await import("@/pages/employer/auth/SignIn");
              return { Component: EmployerSignIn };
            },
          },
          {
            path: "register",
            loader: requireGuest,
            async lazy() {
              const { EmployerRegister } =
                await import("@/pages/employer/auth/register");
              return { Component: EmployerRegister };
            },
          },
        ],
      },

      // 🔒 PRIVATE ROUTES (employer only)
      {
        loader: requireAuth({
          allowedRoles: [ROLES.EMPLOYER],
        }),
        // 📦 Bundled Layout
        async lazy() {
          const { EmployerDashboardLayout, EmployerErrorBoundary } =
            await import("@/pages/employer/EmployerCore");

          return {
            Component: EmployerDashboardLayout,
            ErrorBoundary: EmployerErrorBoundary,
          };
        },
        children: [
          {
            index: true,
            // 📦 Bundled Dashboard (Loads in the exact same network request as the Layout)
            async lazy() {
              const { EmployerDashboard } =
                await import("@/pages/employer/EmployerCore");
              return { Component: EmployerDashboard };
            },
          },
          {
            path: "dashboard",
            // 📦 Bundled Dashboard
            async lazy() {
              const { EmployerDashboard } =
                await import("@/pages/employer/EmployerCore");
              return { Component: EmployerDashboard };
            },
          },
          {
            path: "post-job",
            async lazy() {
              const { PostJob } = await import("@/pages/employer/PostJob");
              return { Component: PostJob };
            },
          },
          {
            path: "view-jobs",
            async lazy() {
              const { ViewJobs } = await import("@/pages/employer/ViewJobs");
              return { Component: ViewJobs };
            },
          },
          {
            path: "view-jobs/:jobId",
            async lazy() {
              const { JobDetail } = await import("@/pages/employer/JobDetail");
              return { Component: JobDetail };
            },
          },
          {
            path: "candidate-pool",
            async lazy() {
              const { CandidatePool } =
                await import("@/pages/employer/CandidatePool");
              return { Component: CandidatePool };
            },
          },
          {
            path: "your-team",
            async lazy() {
              const { Team } = await import("@/pages/employer/Team");
              return { Component: Team };
            },
          },
          {
            path: "managing-subscriptions",
            async lazy() {
              const { Subscriptions } =
                await import("@/pages/employer/Subscriptions");
              return { Component: Subscriptions };
            },
          },
          {
            path: "invoice",
            async lazy() {
              const { Invoice } = await import("@/pages/employer/Invoice");
              return { Component: Invoice };
            },
          },
          {
            path: "profile",
            async lazy() {
              const { EmployerProfile } =
                await import("@/pages/employer/EmployerProfile");
              return { Component: EmployerProfile };
            },
          },
          {
            path: "employee-profile",
            async lazy() {
              const { EmployeeProfile } =
                await import("@/pages/employer/EmployeeProfile");
              return { Component: EmployeeProfile };
            },
          },

          {
            path: "employee-score-card",
            async lazy() {
              const { EmployeeScoreCard } =
                await import("@/pages/employer/EmployeeScoreCard");
              return { Component: EmployeeScoreCard };
            },
          },
          {
            path: "*",
            async lazy() {
              const { EmployerNotFound } =
                await import("@/pages/employer/404/EmployerNotFound");
              return { Component: EmployerNotFound };
            },
          },
        ],
      },
    ],
  },
];

// JobDetail
