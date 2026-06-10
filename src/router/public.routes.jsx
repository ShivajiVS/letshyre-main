import { ScrollToHash } from "@/components/ScrollToHash";

import { RootLayout } from "@/components/layout/RootLayout";
import { PublicLayout } from "@/components/layout/PublicLayout";

const publicRoutes = [
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            path: "/",
            async lazy() {
              const { Landing } = await import("@/pages/Landing");
              // Return it as the Component property.
              // We wrap it in a function here to preserve your ScrollToHash logic.
              return {
                Component: () => (
                  <>
                    <ScrollToHash />
                    <Landing />
                  </>
                ),
              };
            },
          },
          {
            path: "T&C",
            async lazy() {
              const { TermsAndConditions } = await import(
                "@/pages/TermsAndConditions"
              );
              return { Component: TermsAndConditions };
            },
          },
          {
            path: "refund-policy",
            async lazy() {
              const { RefundPolicy } = await import("@/pages/RefundPolicy");
              return { Component: RefundPolicy };
            },
          },
          {
            path: "Policy",
            async lazy() {
              const { PrivacyPolicy } = await import("@/pages/PrivacyPolicy");
              return { Component: PrivacyPolicy };
            },
          },
          {
            path: "/contact",
            async lazy() {
              const { Contact } = await import("@/pages/Contact");
              return { Component: Contact };
            },
          },
        ],
      },
      {
        path: "/get-started",
        async lazy() {
          const { GetStarted } = await import("@/pages/GetStarted");
          return { Component: GetStarted };
        },
      },
      {
        path: "/forgot-password",
        async lazy() {
          const { ForgotPassword } = await import(
            "@/pages/forgot/ForgotPassword"
          );
          return { Component: ForgotPassword };
        },
      },
      {
        path: "download",
        async lazy() {
          const { DownloadApp } = await import("@/pages/employee/DownloadApp");
          return { Component: DownloadApp };
        },
      },
    ],
  },
];

export default publicRoutes;
