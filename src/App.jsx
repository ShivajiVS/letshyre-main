import { RouterProvider } from "react-router";
import { router } from "./router/index";
import { GlobalLoader } from "./components/loading/GlobalLoader";

import "./App.css";

function App() {
  return (
    <>
      <RouterProvider
        router={router}
        fallbackElement={<GlobalLoader />}
      />
    </>
  );
}

export default App;