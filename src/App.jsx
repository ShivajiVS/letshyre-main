import { RouterProvider } from "react-router";
import { Toaster } from "sonner";

import { router } from "./router/index";
import { GlobalLoader } from "./components/loading/GlobalLoader";

import "./App.css";

function App() {
  return (
    <>
      <RouterProvider router={router} fallbackElement={<GlobalLoader />} />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
