/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import { App } from "./App.tsx";

import "./index.css";
import { ToastContainer } from "./components/Toast.tsx";

render(() => (
  <Router>
    <App />
    <ToastContainer />
  </Router>
), document.getElementById("root")!);
