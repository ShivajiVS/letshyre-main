import { ScrollToHash } from "@/components/ScrollToHash";

import { RootLayout } from "@/components/layout/RootLayout";

const publicRoutes = [
  {
    element: <RootLayout />,
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
        path: "/get-started",
        async lazy() {
          const { GetStarted } = await import("@/pages/GetStarted");
          return { Component: GetStarted };
        },
      },
      {
        path: "/forgot-password",
        async lazy() {
          const { ForgotPassword } =
            await import("@/pages/forgot/ForgotPassword");
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
      {
        path: "T&C",
        async lazy() {
          const { TermsAndConditions } = await import("@/pages/TermsAndConditions");
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
];

export default publicRoutes;

// without code splitting:

// import { Landing } from "@/pages/Landing";

// import { GetStarted } from "@/pages/GetStarted";

// import { ForgotPassword } from "@/pages/forgot/ForgotPassword";

// import { ScrollToHash } from "@/components/ScrollToHash";

// const publicRoutes = [
//   {
//     path: "/",

//     element: (
//       <>
//         <ScrollToHash />

//         <Landing />
//       </>
//     ),
//   },

//   {
//     path: "/get-started",

//     element: <GetStarted />,
//   },

//   {
//     path: "/forgot-password",

//     element: <ForgotPassword />,
//   },
// ];

// export default publicRoutes;
