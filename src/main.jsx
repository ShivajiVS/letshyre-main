import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import "./index.css";



// Single QueryClient instance — created outside the component tree so it is
// never re-instantiated on re-renders.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      retry: 1,
    },
    mutations: {
      // Don't auto-retry mutations (e.g. login) to avoid duplicate POSTs.
      retry: 0,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App /> 
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
);
