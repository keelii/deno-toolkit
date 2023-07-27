/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import { ToastContainer } from "./components/Toast.tsx";
import Playground from "./pages/Playground.tsx";
import { Router, useRoutes } from "@solidjs/router";

function App() {
  const Routes = useRoutes([
    { path: "/", component: Playground },
  ]);

  return <Routes />;
}

render(() => (
  <Router>
    <App />
    <ToastContainer />
  </Router>
), document.getElementById("root")!);
